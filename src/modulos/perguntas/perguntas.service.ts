import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePerguntaDto } from './dto/create-pergunta.dto';
import { UpdatePerguntaDto } from './dto/update-pergunta.dto';
import { ReorderPerguntasDto } from './dto/reorder-perguntas.dto';
import { AuditService } from 'src/common/audit/audit.service';

type UserCtx = {
  userId: number;
  tipoUsuario: 'ALUNO' | 'COORDENADOR' | 'ADMIN';
  cursoId?: number | null;
  turmaId?: number | null;
};

@Injectable()
export class PerguntasService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  private async assertPermissaoFormulario(user: UserCtx, formularioId: number) {
    const form = await this.prisma.formulario.findUnique({ where: { id: formularioId } });
    if (!form) throw new NotFoundException('Formulário não encontrado.');

    if (user.tipoUsuario === 'ADMIN') return form;

    if (user.tipoUsuario === 'COORDENADOR') {
      if ((form as any).escopo !== 'CURSO' || form.cursoId !== user.cursoId) {
        throw new ForbiddenException('Sem permissão neste formulário.');
      }
      return form;
    }

    throw new ForbiddenException('Apenas coordenador ou admin podem gerenciar perguntas.');
  }

  async listarParaFormulario(user: UserCtx, formularioId: number) {
    // Listagem é aberta a qualquer autenticado, mas valida visibilidade:
    const form = await this.prisma.formulario.findUnique({ where: { id: formularioId } });
    if (!form) throw new NotFoundException('Formulário não encontrado.');

    if (user.tipoUsuario === 'ALUNO') {
      // precisa ser visível para o aluno
      const now = new Date();
      const dentroJanela =
        (!form.inicioEm || form.inicioEm <= now) && (!form.fimEm || form.fimEm >= now);
      if (!form.ativo || !dentroJanela) {
        throw new ForbiddenException('Formulário indisponível.');
      }
      if ((form as any).escopo === 'CURSO') {
        if (!user.cursoId || user.cursoId !== form.cursoId) {
          throw new ForbiddenException('Formulário não disponível para seu curso.');
        }
        if (form.turmaId && user.turmaId !== form.turmaId) {
          throw new ForbiddenException('Formulário não disponível para sua turma.');
        }
      }
    }
    return this.prisma.pergunta.findMany({
      where: { formularioId },
      orderBy: { ordem: 'asc' },
    });
  }

  async criar(user: UserCtx, dto: CreatePerguntaDto) {
    const form = await this.assertPermissaoFormulario(user, dto.formularioId);
    if (form.ativo) throw new ForbiddenException('Não é possível alterar perguntas de formulário ativo.');

    const max = await this.prisma.pergunta.aggregate({
      where: { formularioId: dto.formularioId },
      _max: { ordem: true },
    });

    const created = await this.prisma.pergunta.create({
      data: {
        formularioId: dto.formularioId,
        tipo: dto.tipo,
        enunciado: dto.enunciado,
        obrigatoria: dto.obrigatoria ?? false,
        configuracao: dto.configuracao ?? null,
        ordem: (max._max.ordem ?? 0) + 1,
      },
    });

    await this.audit.log({
      usuarioId: user.userId,
      acao: 'CREATE',
      entidade: 'PERGUNTA',
      entidadeId: created.id,
      depois: created,
    });

    return created;
  }

    async atualizar(user: UserCtx, id: number, dto: UpdatePerguntaDto) {
    const pergunta = await this.prisma.pergunta.findUnique({ where: { id } });
    if (!pergunta) throw new NotFoundException('Pergunta não encontrada.');

    const form = await this.prisma.formulario.findUnique({ where: { id: pergunta.formularioId } });
    if (!form) throw new NotFoundException('Formulário não encontrado.');

    if (user.tipoUsuario === 'COORDENADOR') {
        if ((form as any).escopo !== 'CURSO' || form.cursoId !== user.cursoId) {
        throw new ForbiddenException('Sem permissão neste formulário.');
        }
    }
    if (form.ativo) throw new ForbiddenException('Não é possível alterar perguntas de formulário ativo.');

    // Monta apenas os campos enviados
    const data: any = {};
    if (Object.prototype.hasOwnProperty.call(dto, 'tipo')) data.tipo = dto.tipo;
    if (Object.prototype.hasOwnProperty.call(dto, 'enunciado')) data.enunciado = dto.enunciado;
    if (Object.prototype.hasOwnProperty.call(dto, 'obrigatoria')) data.obrigatoria = dto.obrigatoria;
    if (Object.prototype.hasOwnProperty.call(dto, 'configuracao')) data.configuracao = dto.configuracao;

    // Se nada foi enviado, retorna o original
    if (Object.keys(data).length === 0) return pergunta;

    const antes = pergunta;
    const updated = await this.prisma.pergunta.update({
        where: { id },
        data,
    });

    await this.audit.log({
        usuarioId: user.userId,
        acao: 'UPDATE',
        entidade: 'PERGUNTA',
        entidadeId: id,
        antes,
        depois: updated,
    });

    return updated;
  }


  async remover(user: UserCtx, id: number) {
    const pergunta = await this.prisma.pergunta.findUnique({ where: { id } });
    if (!pergunta) throw new NotFoundException('Pergunta não encontrada.');

    const form = await this.assertPermissaoFormulario(user, pergunta.formularioId);
    if (form.ativo) throw new ForbiddenException('Não é possível excluir perguntas de formulário ativo.');

    await this.audit.log({
      usuarioId: user.userId,
      acao: 'DELETE',
      entidade: 'PERGUNTA',
      entidadeId: id,
      antes: pergunta,
    });

    return this.prisma.pergunta.delete({ where: { id } });
  }

  async reordenar(user: UserCtx, formularioId: number, dto: ReorderPerguntasDto) {
    const form = await this.assertPermissaoFormulario(user, formularioId);
    if (form.ativo) throw new ForbiddenException('Não é possível reordenar perguntas de formulário ativo.');


    const ids = dto.itens.map(i => i.id);
    const existentes = await this.prisma.pergunta.findMany({ where: { id: { in: ids } } });
    if (existentes.some(p => p.formularioId !== formularioId)) {
      throw new ForbiddenException('Todas as perguntas precisam pertencer ao mesmo formulário.');
    }

    const antes = await this.prisma.pergunta.findMany({
      where: { formularioId },
      orderBy: { ordem: 'asc' },
    });

    await this.prisma.$transaction(
      dto.itens.map(i =>
        this.prisma.pergunta.update({ where: { id: i.id }, data: { ordem: i.ordem } }),
      ),
    );

    const depois = await this.prisma.pergunta.findMany({
      where: { formularioId },
      orderBy: { ordem: 'asc' },
    });

    await this.audit.log({
      usuarioId: user.userId,
      acao: 'UPDATE',
      entidade: 'PERGUNTA',
      entidadeId: formularioId,
      antes,
      depois,
    });

    return { ok: true };
  }
}