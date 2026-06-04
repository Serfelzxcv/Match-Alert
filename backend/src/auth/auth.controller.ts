import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OAuthGuard } from './guards/oauth.guard';
import { AuthenticatedRequest, OAuthProfile } from './types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.getProfile(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() request: AuthenticatedRequest, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(request.user.sub, updateProfileDto);
  }

  @UseGuards(OAuthGuard('google'))
  @Get('google')
  googleAuth() {
    return;
  }

  @UseGuards(OAuthGuard('google'))
  @Get('google/callback')
  async googleCallback(@Req() request: Request & { user: OAuthProfile }, @Res() response: Response) {
    const result = await this.authService.validateOAuthLogin(request.user);
    return this.redirectWithToken(response, result.accessToken);
  }

  @UseGuards(OAuthGuard('facebook'))
  @Get('facebook')
  facebookAuth() {
    return;
  }

  @UseGuards(OAuthGuard('facebook'))
  @Get('facebook/callback')
  async facebookCallback(@Req() request: Request & { user: OAuthProfile }, @Res() response: Response) {
    const result = await this.authService.validateOAuthLogin(request.user);
    return this.redirectWithToken(response, result.accessToken);
  }

  private redirectWithToken(response: Response, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    return response.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`);
  }
}
