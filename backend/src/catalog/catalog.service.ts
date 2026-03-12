import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetProductsDto } from './dto/get-products.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Listagem com filtros facetados + paginação ──────────────────────────────
  async findAll(dto: GetProductsDto) {
    const {
      search,
      category,
      brands,
      minPrice,
      maxPrice,
      isRefurbished,
      page = 1,
      limit = 20,
      sort = 'newest',
    } = dto;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category }),
      ...(brands?.length && { brand: { in: brands } }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            basePrice: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
      ...(isRefurbished !== undefined && { isRefurbished: Boolean(isRefurbished) }),
    };

    const orderBy = this.buildOrderBy(sort);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          basePrice: true,
          dynamicPrice: true,
          brand: true,
          category: true,
          imageUrls: true,
          isRefurbished: true,
          isFeatured: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Gera facets para filtros do frontend
    const facets = await this.buildFacets(where);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      facets,
    };
  }

  // ─── Detalhe do produto ──────────────────────────────────────────────────────
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        inventory: {
          include: { location: true },
          where: { quantity: { gt: 0 } },
        },
      },
    });
    return product;
  }

  // ─── Produtos relacionados ───────────────────────────────────────────────────
  async findRelated(productId: string, category: string, limit = 4) {
    return this.prisma.product.findMany({
      where: {
        category,
        id: { not: productId },
        isActive: true,
      },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        dynamicPrice: true,
        imageUrls: true,
        brand: true,
      },
    });
  }

  // ─── PIM Webhook — atualiza ou cria produto via evento externo ───────────────
  async upsertFromPim(pimId: string, data: Partial<Prisma.ProductCreateInput>) {
    return this.prisma.product.upsert({
      where: { pimId },
      create: { pimId, ...data } as Prisma.ProductCreateInput,
      update: data,
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  private buildOrderBy(sort: string): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
      case 'price_asc':
        return { basePrice: 'asc' };
      case 'price_desc':
        return { basePrice: 'desc' };
      case 'name_asc':
        return { name: 'asc' };
      default:
        return { createdAt: 'desc' };
    }
  }

  private async buildFacets(excludedCategory?: Prisma.ProductWhereInput) {
    const [categories, brands, priceRange] = await Promise.all([
      this.prisma.product.groupBy({
        by: ['category'],
        where: { isActive: true },
        _count: { category: true },
      }),
      this.prisma.product.groupBy({
        by: ['brand'],
        where: { isActive: true },
        _count: { brand: true },
        orderBy: { _count: { brand: 'desc' } },
        take: 20,
      }),
      this.prisma.product.aggregate({
        where: { isActive: true },
        _min: { basePrice: true },
        _max: { basePrice: true },
      }),
    ]);

    return {
      categories: categories.map((c) => ({ value: c.category, count: c._count.category })),
      brands: brands.map((b) => ({ value: b.brand, count: b._count.brand })),
      priceRange: {
        min: priceRange._min.basePrice,
        max: priceRange._max.basePrice,
      },
    };
  }
}
