import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Lojas disponíveis para BOPIS ────────────────────────────────────────────
  async getLocations() {
    return this.prisma.location.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        isActive: true,
      },
    });
  }

  // ─── Disponibilidade de um produto por loja ──────────────────────────────────
  async getProductAvailability(productId: string) {
    const inventory = await this.prisma.inventory.findMany({
      where: { productId },
      include: {
        location: {
          select: { id: true, name: true, city: true, state: true, isActive: true },
        },
      },
    });

    return inventory.map((inv) => ({
      locationId: inv.locationId,
      location: inv.location,
      quantity: inv.quantity,
      reservedQuantity: inv.reservedQuantity,
      availableQty: inv.quantity - inv.reservedQuantity,
    }));
  }

  // ─── Nível de estoque geral (admin) ─────────────────────────────────────────
  async getLowStockAlerts(threshold = 5) {
    const lowStock = await this.prisma.inventory.findMany({
      where: { quantity: { lte: threshold } },
      include: {
        product: { select: { name: true, brand: true } },
        location: { select: { name: true, city: true } },
      },
      orderBy: { quantity: 'asc' },
      take: 100,
    });

    this.logger.warn(`Found ${lowStock.length} items with low stock (≤ ${threshold})`);
    return lowStock;
  }

  // ─── Ajuste manual de estoque (recebimento, devolução) ──────────────────────
  async adjustStock(inventoryId: string, delta: number, reason: string) {
    const updated = await this.prisma.inventory.update({
      where: { id: inventoryId },
      data: { quantity: { increment: delta } },
      include: { product: { select: { name: true } }, location: { select: { name: true } } },
    });

    this.logger.log(
      `Stock adjusted: ${updated.product.name} @ ${updated.location.name} | Delta: ${delta > 0 ? '+' : ''}${delta} | Reason: ${reason}`,
    );

    return updated;
  }
}
