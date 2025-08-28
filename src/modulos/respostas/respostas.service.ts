import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRespostaDto } from './dto/create-resposta.dto';

type UserCtx = {
  userId: number;
  tipoUsuario: 'ALUNO' | 'COORDENADOR' | 'ADMIN';
  cursoId?: number | null;
  turmaId?: number | null;
};

@Injectable()
export class RespostasService {
  constructor(private prisma: PrismaService) {}

  async criar(user: UserCtx, dto: CreateRespostaDto) {
    const form = await this.prisma.formulario.findUnique({ where: { id: dto.formularioId } });
    if (!form || !form.ativo) throw new NotFoundException('Formulário indisponível.');

    const now = new Date();
    if ((form.inicioEm && form.inicioEm > now) || (form.fimEm && form.fimEm < now)) {
      throw new ForbiddenException('Fora da janela de disponibilidade.');
    }

    // visibilidade por curso/turma
    if ((form as any).escopo === 'CURSO') {
      if (!user.cursoId || user.cursoId !== form.cursoId) {
        throw new ForbiddenException('Formulário não disponível para seu curso.');
      }
      if (form.turmaId && user.turmaId !== form.turmaId) {
        throw new ForbiddenException('Formulário não disponível para sua turma.');
      }
    }

    const pergunta = await this.prisma.pergunta.findUnique({ where: { id: dto.perguntaId } });
    if (!pergunta || pergunta.formularioId !== form.id) {
      throw new BadRequestException('Pergunta inválida para este formulário.');
    }

 
      let valorJson: any = dto.valor;
      if (typeof valorJson === 'string') {
        try {
          valorJson = JSON.parse(valorJson);
        } catch {
        }
      }

      if (pergunta.obrigatoria) {
        const isEmptyObject =
          typeof valorJson === 'object' && valorJson !== null && !Array.isArray(valorJson) && Object.keys(valorJson).length === 0;
        const isEmptyArray = Array.isArray(valorJson) && valorJson.length === 0;
        const isEmptyString = typeof valorJson === 'string' && valorJson.trim() === '';
        if (valorJson === null || isEmptyObject || isEmptyArray || isEmptyString) {
          throw new BadRequestException('Resposta obrigatória não preenchida.');
        }
      }

    return this.prisma.resposta.create({
      data: {
        formularioId: form.id,
        perguntaId: pergunta.id,
        usuarioId: form.anonimo ? null : user.userId,
        cursoId: user.cursoId ?? null,
        turmaId: user.turmaId ?? null,
        valor: valorJson,
      },
    });
  }
}
