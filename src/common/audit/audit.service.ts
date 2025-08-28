import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    usuarioId: number;
    acao: 'CREATE' | 'UPDATE' | 'DELETE' | 'ACTIVATE' | 'DEACTIVATE' | string;
    entidade: 'FORMULARIO' | 'PERGUNTA' | string;
    entidadeId: number;
    antes?: any;
    depois?: any;
  }) {
    const { usuarioId, acao, entidade, entidadeId, antes, depois } = params;
    await this.prisma.logEvento.create({
      data: {
        usuarioId,
        acao,
        entidade,
        entidadeId,
        antes: antes ?? null,
        depois: depois ?? null,
      },
    });
  }
}
