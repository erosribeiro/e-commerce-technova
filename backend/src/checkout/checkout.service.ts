import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FulfillmentMethod, OrderStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Criar o pedido com reserva de estoque e desconto de créditos ─────────────
  async createOrder(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Verificar e reservar estoque
      const itemsWithPrices = await Promise.all(
        dto.items.map(async (item) => {
          const product = await tx.product.findUnique({
            where: { id: item.productId, isActive: true },
          });
          if (!product) {
            throw new NotFoundException(`Produto ${item.productId} não encontrado`);
          }

          // Reserva de estoque: pega qualquer rdc com quantidade suficiente
          const inventory = await tx.inventory.findFirst({
            where: { productId: item.productId, quantity: { gte: item.quantity } },
          });
          if (!inventory) {
            throw new BadRequestException(
              `Produto "${product.name}" sem estoque suficiente`,
            );
          }

          // Reservar estoque
          await tx.inventory.update({
            where: { id: inventory.id },
            data: {
              quantity: { decrement: item.quantity },
              reservedQuantity: { increment: item.quantity },
            },
          });

          const unitPrice = (product.dynamicPrice || product.basePrice) as Decimal;
          return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice,
          };
        }),
      );

      // 2. Calcular total
      const subtotal = itemsWithPrices.reduce(
        (acc, i) => acc + Number(i.unitPrice) * i.quantity,
        0,
      );

      // 3. Aplicar créditos trade-in
      const user = await tx.user.findUnique({ where: { id: userId } });
      let tradeInCreditsUsed = 0;
      const requested = dto.tradeInCreditsToUse || 0;

      if (requested > 0) {
        const available = Number(user.tradeInCredits);
        tradeInCreditsUsed = Math.min(requested, available, subtotal);

        await tx.user.update({
          where: { id: userId },
          data: { tradeInCredits: { decrement: tradeInCreditsUsed } },
        });
      }

      const totalAmount = subtotal - tradeInCreditsUsed;

      // 4. Criar order
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          discountApplied: 0,
          tradeInCreditsUsed,
          status: OrderStatus.PENDING,
          fulfillmentMethod: dto.fulfillmentMethod,
          locationId: dto.fulfillmentMethod === FulfillmentMethod.BOPIS ? dto.locationId : null,
          shippingAddress: dto.shippingAddress,
          items: {
            create: itemsWithPrices,
          },
        },
        include: { items: { include: { product: true } } },
      });

      this.logger.log(
        `Order ${order.id} created for user ${userId} — Total: R$ ${totalAmount.toFixed(2)}`,
      );

      return { order, message: 'Pedido criado. Aguardando pagamento.' };
    });
  }

  // ─── Histórico de pedidos do usuário ────────────────────────────────────────
  async getUserOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: { select: { name: true, imageUrls: true, slug: true } },
            },
          },
        },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Detalhe de um pedido ───────────────────────────────────────────────────
  async getOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: { include: { product: true } },
      },
    });
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return order;
  }

  // ─── Atualizar status/rastreamento (admin/fulfillment) ──────────────────────
  async updateTracking(orderId: string, trackingCode: string, status: any) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { trackingCode, trackingStatus: status, status: OrderStatus.SHIPPED },
    });
  }
}
