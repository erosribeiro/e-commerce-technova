import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get('locations')
  @ApiOperation({ summary: 'Listar lojas físicas disponíveis para BOPIS' })
  async getLocations() {
    return this.inventoryService.getLocations();
  }

  @Get('products/:productId/availability')
  @ApiOperation({ summary: 'Disponibilidade de um produto por loja' })
  async getAvailability(@Param('productId') productId: string) {
    return this.inventoryService.getProductAvailability(productId);
  }

  @Get('alerts/low-stock')
  @ApiOperation({ summary: 'Alertas de estoque baixo (admin)' })
  async lowStockAlerts(@Query('threshold') threshold = 5) {
    return this.inventoryService.getLowStockAlerts(+threshold);
  }

  @Post(':id/adjust')
  @ApiOperation({ summary: 'Ajuste manual de estoque (recebimento/devolução)' })
  async adjust(
    @Param('id') id: string,
    @Body() body: { delta: number; reason: string },
  ) {
    return this.inventoryService.adjustStock(id, body.delta, body.reason);
  }
}
