import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@Request() req: any, @Body() data: { name?: string; email?: string }) {
    return this.usersService.updateProfile(req.user.userId, data);
  }

  @Get('wishlist')
  @ApiOperation({ summary: 'Get user wishlist' })
  getWishlist(@Request() req: any) {
    return this.usersService.getWishlist(req.user.userId);
  }

  @Post('wishlist/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle product in wishlist' })
  toggleWishlist(@Request() req: any, @Param('productId') productId: string) {
    return this.usersService.toggleWishlist(req.user.userId, productId);
  }
}
