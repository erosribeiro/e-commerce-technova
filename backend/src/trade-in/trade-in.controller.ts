import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TradeInService } from './trade-in.service';
import { CreateTradeInDto, UpdateInspectionDto } from './dto/trade-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('trade-in')
@Controller('trade-in')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class TradeInController {
  constructor(private tradeInService: TradeInService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar aparelho para trade-in e obter estimativa de crédito' })
  async create(@Request() req: any, @Body() dto: CreateTradeInDto) {
    return this.tradeInService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar trade-ins do usuário autenticado' })
  async myTradeIns(@Request() req: any) {
    return this.tradeInService.findByUser(req.user.userId);
  }

  @Put(':id/inspection')
  @ApiOperation({ summary: 'Atualizar resultado da inspeção (back-office)' })
  async updateInspection(@Param('id') id: string, @Body() dto: UpdateInspectionDto) {
    return this.tradeInService.updateInspection(id, dto);
  }
}
