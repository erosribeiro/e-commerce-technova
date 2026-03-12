import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { GetProductsDto } from './dto/get-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get('products')
  @ApiOperation({ summary: 'Listar produtos com filtros facetados e paginação' })
  async findAll(@Query() dto: GetProductsDto) {
    return this.catalogService.findAll(dto);
  }

  @Get('products/:slug')
  @ApiOperation({ summary: 'Detalhe do produto por slug' })
  async findOne(@Param('slug') slug: string) {
    return this.catalogService.findBySlug(slug);
  }

  @Get('products/:productId/related')
  @ApiOperation({ summary: 'Produtos relacionados (mesma categoria)' })
  async related(@Param('productId') productId: string, @Query('category') category: string) {
    return this.catalogService.findRelated(productId, category);
  }

  @Post('webhook/pim')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Webhook para atualizar catálogo via evento PIM (Akeneo/Pimcore)' })
  async pimWebhook(@Body() body: { pimId: string; data: any }) {
    return this.catalogService.upsertFromPim(body.pimId, body.data);
  }
}
