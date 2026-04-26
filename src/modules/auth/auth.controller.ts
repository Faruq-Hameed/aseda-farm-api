import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.userId);
  }
}
