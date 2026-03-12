import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, EnableMfaDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ─── Registro ────────────────────────────────────────────────────────────────
  @Post('register')
  @Throttle({ default: { ttl: 60000, limit: 5 } }) // Max 5 registros por minuto
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado' })
  @ApiResponse({ status: 409, description: 'E-mail já em uso' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ─── Login ───────────────────────────────────────────────────────────────────
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 10 } }) // Max 10 tentativas por minuto (anti brute-force)
  @ApiOperation({ summary: 'Login com e-mail, senha e opcionalmente token MFA' })
  @ApiResponse({ status: 200, description: 'JWT + Refresh Token retornados' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── Refresh Tokens ──────────────────────────────────────────────────────────
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Renovar access token via refresh token' })
  async refresh(@Request() req: any) {
    const { userId, refreshToken } = req.user;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  // ─── Logout ──────────────────────────────────────────────────────────────────
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Logout — invalida o refresh token' })
  async logout(@Request() req: any) {
    return this.authService.logout(req.user.userId);
  }

  // ─── MFA: Gerar QR Code ──────────────────────────────────────────────────────
  @Get('mfa/generate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Gera secret MFA e retorna QR Code para o app autenticador' })
  async generateMfa(@Request() req: any) {
    return this.authService.generateMfaSecret(req.user.userId);
  }

  // ─── MFA: Ativar ─────────────────────────────────────────────────────────────
  @Post('mfa/enable')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Confirma o código TOTP e ativa o MFA na conta' })
  async enableMfa(@Request() req: any, @Body() dto: EnableMfaDto) {
    return this.authService.enableMfa(req.user.userId, dto.token);
  }

  // ─── Perfil atual ────────────────────────────────────────────────────────────
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Retorna dados do usuário autenticado' })
  getMe(@Request() req: any) {
    return req.user;
  }
}
