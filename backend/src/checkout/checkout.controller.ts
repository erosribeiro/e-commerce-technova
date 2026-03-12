import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('checkout')
@Controller('checkout')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @Post('orders')
  @ApiOperation({ summary: 'Criar pedido (com suporte a BOPIS e créditos trade-in)' })
  async create(@Request() req: any, @Body() dto: CreateOrderDto) {
    return this.checkoutService.createOrder(req.user.userId, dto);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Listar pedidos do usuário autenticado' })
  async myOrders(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.checkoutService.getUserOrders(req.user.userId, +page, +limit);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Detalhe de um pedido' })
  async getOne(@Param('id') id: string, @Request() req: any) {
    return this.checkoutService.getOrder(id, req.user.userId);
  }

  @Put('orders/:id/tracking')
  @ApiOperation({ summary: 'Atualizar código de rastreamento (operacional)' })
  async updateTracking(
    @Param('id') id: string,
    @Body() body: { trackingCode: string; status: string },
  ) {
    return this.checkoutService.updateTracking(id, body.trackingCode, body.status);
  }
}
