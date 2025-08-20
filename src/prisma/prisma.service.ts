// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Este método é chamado automaticamente quando o módulo é inicializado.
    // Aqui, nós nos conectamos ao banco de dados.
    await this.$connect();
  }
}
