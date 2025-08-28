import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PerguntasService } from './perguntas.service';
import { CreatePerguntaDto } from './dto/create-pergunta.dto';
import { UpdatePerguntaDto } from './dto/update-pergunta.dto';
import { ReorderPerguntasDto } from './dto/reorder-perguntas.dto';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

class IdParamDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}

class FormParamDto {
  @Type(() => Number)
  @IsInt()
  formularioId: number;
}

@Controller()
@UseGuards(JwtAuthGuard)
export class PerguntasController {
  constructor(private readonly service: PerguntasService) {}

  @Get('formularios/:formularioId/perguntas')
  async listar(@Req() req: any, @Param() { formularioId }: FormParamDto) {
    return this.service.listarParaFormulario(req.user, formularioId);
  }

  @Post('formularios/:formularioId/perguntas')
  @UseGuards(RolesGuard)
  @Roles('COORDENADOR', 'ADMIN')
  async criar(
    @Req() req: any,
    @Param() { formularioId }: FormParamDto,
    @Body(new ValidationPipe({ transform: true, whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    body: Omit<CreatePerguntaDto, 'formularioId'> & Partial<CreatePerguntaDto>,
  ) {
    const dto: CreatePerguntaDto = {
      formularioId,
      tipo: body.tipo!,
      enunciado: body.enunciado!,
      obrigatoria: body.obrigatoria ?? false,
      configuracao: body.configuracao ?? null,
    };
    return this.service.criar(req.user, dto);
  }

    @Patch('perguntas/:id')
    @UseGuards(RolesGuard)
    @Roles('COORDENADOR', 'ADMIN')
    async atualizar(
    @Req() req: any,
    @Param() { id }: IdParamDto,
    @Body(new ValidationPipe({ transform: true, whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    dto: UpdatePerguntaDto,
    ) {
    return this.service.atualizar(req.user, id, dto);
    }

  @Delete('perguntas/:id')
  @UseGuards(RolesGuard)
  @Roles('COORDENADOR', 'ADMIN')
  async remover(@Req() req: any, @Param() { id }: IdParamDto) {
    return this.service.remover(req.user, id);
  }

  @Post('formularios/:formularioId/perguntas/reordenar')
  @UseGuards(RolesGuard)
  @Roles('COORDENADOR', 'ADMIN')
  async reordenar(
    @Req() req: any,
    @Param() { formularioId }: FormParamDto,
    @Body(new ValidationPipe({ transform: true, whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    dto: ReorderPerguntasDto,
  ) {
    return this.service.reordenar(req.user, formularioId, dto);
  }
}