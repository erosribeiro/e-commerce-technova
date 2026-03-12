import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FulfillmentMethod } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ enum: FulfillmentMethod, default: FulfillmentMethod.SHIPPING })
  @IsEnum(FulfillmentMethod)
  fulfillmentMethod: FulfillmentMethod;

  @ApiPropertyOptional({ description: 'ID da loja para retirada BOPIS' })
  @IsString()
  @IsOptional()
  locationId?: string;

  @ApiPropertyOptional({ description: 'Créditos trade-in a aplicar (em R$)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  tradeInCreditsToUse?: number;

  @ApiPropertyOptional({
    description: 'Endereço de entrega',
    example: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
  })
  @IsObject()
  @IsOptional()
  shippingAddress?: Record<string, string>;
}
