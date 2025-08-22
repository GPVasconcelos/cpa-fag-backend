import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    // retorna { access_token }
    return this.authService.login(dto.email, dto.senha);
  }

  // rota util para testar o token no Postman
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    // req.user vem da JwtStrategy.validate
    return req.user;
  }
}
