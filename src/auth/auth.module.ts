// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module'; // Importe o PrismaModule
import { JwtStrategy } from './jwt.strategy'; // Criaremos este arquivo a seguir

@Module({
  imports: [
    PrismaModule, // Disponibiliza o PrismaService para o AuthService
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Carrega o segredo do .env
      signOptions: { expiresIn: '1h' }, // Token expira em 1 hora (ex: '1h', '7d')
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Registre o AuthService e a Estratégia JWT
})
export class AuthModule {}
