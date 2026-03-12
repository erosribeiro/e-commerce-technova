import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { CheckoutModule } from './checkout/checkout.module';
import { TradeInModule } from './trade-in/trade-in.module';
import { InventoryModule } from './inventory/inventory.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // ─── Config ───────────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ─── Rate Limiting (proteção contra brute-force) ──────────────────────────
    ThrottlerModule.forRoot([
      {
        ttl: 60000,  // 1 minuto
        limit: 60,   // 60 requests por minuto para rotas normais
      },
    ]),

    // ─── Módulos de Domínio ───────────────────────────────────────────────────
    PrismaModule,
    AuthModule,
    CatalogModule,
    CheckoutModule,
    TradeInModule,
    InventoryModule,
    UsersModule,
  ],
})
export class AppModule {}
