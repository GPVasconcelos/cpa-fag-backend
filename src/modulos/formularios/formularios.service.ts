import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';

type UserCtx = {
  userId: number;
  tipoUsuario: 'ALUNO' | 'COORDENADOR' | 'ADMIN';
  cursoId?: number | null;
  turmaId?: number | null;
};

@Injectable()
export class FormulariosService {
  constructor(private prisma: PrismaService) {}

  async listarVisiveis(user: UserCtx) {
    const now = new Date();

    if (user.tipoUsuario === 'ADMIN') {
      return this.prisma.formulario.findMany({
        where: {
          ativo: true,
          AND: [
            { OR: [{ inicioEm: null }, { inicioEm: { lte: now } }] },
            { OR: [{ fimEm: null }, { fimEm: { gte: now } }] },
          ],
        },
        orderBy: { criadoEm: 'desc' },
      });
    }

    if (user.tipoUsuario === 'COORDENADOR') {
      return this.prisma.formulario.findMany({
        where: {
          ativo: true,
          AND: [
            { OR: [{ inicioEm: null }, { inicioEm: { lte: now } }] },
            { OR: [{ fimEm: null }, { fimEm: { gte: now } }] },
          ],
          OR: [
            { escopo: 'INSTITUCIONAL' as any },
            { escopo: 'CURSO' as any, cursoId: user.cursoId ?? undefined },
          ],
        },
        orderBy: { criadoEm: 'desc' },
      });
    }

    // ALUNO
    return this.prisma.formulario.findMany({
      where: {
        ativo: true,
        AND: [
          { OR: [{ inicioEm: null }, { inicioEm: { lte: now } }] },
          { OR: [{ fimEm: null }, { fimEm: { gte: now } }] },
        ],
        OR: [
          { escopo: 'INSTITUCIONAL' as any },
          {
            escopo: 'CURSO' as any,
            AND: [
              { cursoId: user.cursoId ?? undefined },
              { OR: [{ turmaId: null }, { turmaId: user.turmaId ?? undefined }] },
            ],
          },
        ],
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async criar(user: UserCtx, dto: CreateFormularioDto) {
    if (user.tipoUsuario === 'COORDENADOR') {
      if (dto.escopo !== 'CURSO') {
        throw new ForbiddenException('Coordenador só pode criar formulário de escopo CURSO.');
      }
      if (!user.cursoId) {
        throw new ForbiddenException('Coordenador sem curso vinculado.');
      }
      dto.cursoId = user.cursoId; // força curso do coordenador
    }

    if (dto.escopo === 'CURSO' && (dto.cursoId === undefined || dto.cursoId === null)) {
      throw new ForbiddenException('cursoId é obrigatório quando escopo=CURSO.');
    }

    return this.prisma.formulario.create({
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao ?? null,
        escopo: dto.escopo as any, // enum do Prisma
        cursoId: dto.escopo === 'CURSO' ? dto.cursoId! : null,
        turmaId: dto.turmaId ?? null,
        anonimo: dto.anonimo ?? false,
        ativo: false,
        inicioEm: dto.inicioEm ? new Date(dto.inicioEm) : null,
        fimEm: dto.fimEm ? new Date(dto.fimEm) : null,
        criadoPorId: user.userId,
        publicadoEm: null,
      },
    });
  }

  async atualizar(user: UserCtx, id: number, dto: UpdateFormularioDto) {
    const form = await this.prisma.formulario.findUnique({ where: { id } });
    if (!form) throw new NotFoundException('Formulário não encontrado.');

    if (user.tipoUsuario === 'COORDENADOR') {
      if ((form as any).escopo !== 'CURSO' || form.cursoId !== user.cursoId) {
        throw new ForbiddenException('Sem permissão sobre este formulário.');
      }
    }

    if (dto.escopo && dto.escopo !== (form as any).escopo) {
      throw new ForbiddenException('Não é permitido alterar o escopo.');
    }

    return this.prisma.formulario.update({
      where: { id },
      data: {
        titulo: dto.titulo ?? form.titulo,
        descricao: dto.descricao ?? form.descricao,
        turmaId: dto.turmaId ?? form.turmaId,
        anonimo: dto.anonimo ?? form.anonimo,
        inicioEm: dto.inicioEm ? new Date(dto.inicioEm) : form.inicioEm,
        fimEm: dto.fimEm ? new Date(dto.fimEm) : form.fimEm,
      },
    });
  }

  async setAtivo(user: UserCtx, id: number, ativo: boolean) {
    const form = await this.prisma.formulario.findUnique({ where: { id } });
    if (!form) throw new NotFoundException('Formulário não encontrado.');

    if (user.tipoUsuario === 'COORDENADOR') {
      if ((form as any).escopo !== 'CURSO' || form.cursoId !== user.cursoId) {
        throw new ForbiddenException('Sem permissão sobre este formulário.');
      }
    }

    return this.prisma.formulario.update({
      where: { id },
      data: {
        ativo,
        publicadoEm: ativo ? new Date() : null,
      },
    });
  }
}
