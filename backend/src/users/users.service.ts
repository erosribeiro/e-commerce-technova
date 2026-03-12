import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, tradeInCredits: true, mfaEnabled: true, createdAt: true }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, role: true }
    });
  }

  async getWishlist(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        wishlist: {
          select: {
            id: true,
            name: true,
            slug: true,
            basePrice: true,
            imageUrls: true,
            brand: true,
            category: true,
            isFeatured: true,
            isRefurbished: true,
          }
        }
      }
    });

    return user?.wishlist || [];
  }

  async toggleWishlist(userId: string, productId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wishlist: { select: { id: true } } }
    });

    if (!user) throw new NotFoundException('User not found');

    const productExists = await this.prisma.product.findUnique({ where: { id: productId }});
    if (!productExists) throw new NotFoundException('Product not found');

    const isWished = user.wishlist.some(p => p.id === productId);

    if (isWished) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          wishlist: {
            disconnect: { id: productId }
          }
        }
      });
      return { message: 'Product removed from wishlist', status: 'removed' };
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          wishlist: {
            connect: { id: productId }
          }
        }
      });
      return { message: 'Product added to wishlist', status: 'added' };
    }
  }
}
