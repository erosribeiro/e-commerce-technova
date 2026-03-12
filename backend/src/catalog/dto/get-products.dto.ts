import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsDto {
  @ApiPropertyOptional({ description: 'Texto de busca (full-text)' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar por categoria' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Filtrar por marca(s)', isArray: true, type: String })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  brands?: string[];

  @ApiPropertyOptional({ description: 'Preço mínimo', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Preço máximo' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Retornar apenas produtos recondicionados' })
  @IsOptional()
  isRefurbished?: boolean;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({
    enum: ['price_asc', 'price_desc', 'name_asc', 'newest'],
    default: 'newest',
  })
  @IsString()
  @IsOptional()
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'newest' = 'newest';
}
