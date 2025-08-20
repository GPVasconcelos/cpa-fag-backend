// src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Torna o PrismaService disponível globalmente para outros módulos
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta o serviço para que possa ser injetado
})
export class PrismaModule {}
