import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTradeInDto, UpdateInspectionDto } from './dto/trade-in.dto';
import { TradeInInspectionStatus, ConditionGrade } from '@prisma/client';

// Tabela de estimativa de crédito por grade (simplificada — em produção, vem de um ML model)
const CREDIT_MULTIPLIER: Record<ConditionGrade, number> = {
  [ConditionGrade.A]: 1.0,
  [ConditionGrade.B]: 0.7,
  [ConditionGrade.C]: 0.4,
};

// Valores base de referência por categoria (em R$) — simplificado
const BASE_VALUES: Record<string, number> = {
  smartphone: 300,
  notebook: 800,
  tablet: 400,
  smartwatch: 200,
  default: 150,
};

@Injectable()
export class TradeInService {
  private readonly logger = new Logger(TradeInService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Registrar aparelho para trade-in ────────────────────────────────────────
  async create(userId: string, dto: CreateTradeInDto) {
    const estimated = this.estimateCreditValue(dto.deviceCategory, dto.conditionGrade);

    const tradeIn = await this.prisma.tradeInProgram.create({
      data: {
        userId,
        deviceCategory: dto.deviceCategory,
        deviceBrand: dto.deviceBrand,
        deviceModel: dto.deviceModel,
        conditionGrade: dto.conditionGrade,
        estimatedRebateValue: estimated,
        inspectionStatus: TradeInInspectionStatus.PENDING,
      },
    });

    this.logger.log(
      `TradeIn ${tradeIn.id} created — estimated credit: R$ ${estimated}`,
    );

    return {
      ...tradeIn,
      message: `Estimativa de crédito: R$ ${estimated.toFixed(2)}. Envie o aparelho para confirmar o valor real.`,
    };
  }

  // ─── Listar trade-ins do usuário ─────────────────────────────────────────────
  async findByUser(userId: string) {
    return this.prisma.tradeInProgram.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Atualizar inspeção (back-office) ────────────────────────────────────────
  async updateInspection(tradeInId: string, dto: UpdateInspectionDto) {
    const tradeIn = await this.prisma.tradeInProgram.findUnique({
      where: { id: tradeInId },
    });
    if (!tradeIn) throw new NotFoundException('Trade-in não encontrado');

    // Se foi creditado, aplica créditos na carteira do usuário
    if (dto.inspectionStatus === TradeInInspectionStatus.CREDITED) {
      await this.prisma.$transaction([
        this.prisma.tradeInProgram.update({
          where: { id: tradeInId },
          data: {
            inspectionStatus: TradeInInspectionStatus.CREDITED,
            estimatedRebateValue: dto.finalCreditValue,
            inspectionNotes: dto.inspectionNotes,
            creditedAt: new Date(),
          },
        }),
        this.prisma.user.update({
          where: { id: tradeIn.userId },
          data: { tradeInCredits: { increment: dto.finalCreditValue } },
        }),
      ]);

      this.logger.log(
        `TradeIn ${tradeInId} credited R$ ${dto.finalCreditValue} to user ${tradeIn.userId}`,
      );

      return { message: `R$ ${dto.finalCreditValue.toFixed(2)} creditados na carteira do usuário` };
    }

    return this.prisma.tradeInProgram.update({
      where: { id: tradeInId },
      data: {
        inspectionStatus: dto.inspectionStatus as TradeInInspectionStatus,
        inspectionNotes: dto.inspectionNotes,
      },
    });
  }

  // ─── Estimativa de crédito ───────────────────────────────────────────────────
  private estimateCreditValue(category: string, grade: ConditionGrade): number {
    const categoryKey = category.toLowerCase();
    const base = BASE_VALUES[categoryKey] || BASE_VALUES.default;
    const multiplier = CREDIT_MULTIPLIER[grade];
    return Math.round(base * multiplier * 100) / 100;
  }
}
