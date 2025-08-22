import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { FormulariosService } from './formularios.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

class IdParamDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}

@Controller('formularios')
@UseGuards(JwtAuthGuard)
export class FormulariosController {
  constructor(private readonly service: FormulariosService) {}

  @Get()
  async listar(@Req() req: any) {
    return this.service.listarVisiveis(req.user);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('COORDENADOR', 'ADMIN')
  async criar(@Req() req: any, @Body() dto: CreateFormularioDto) {
    return this.service.criar(req.user, dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('COORDENADOR', 'ADMIN')
  async atualizar(@Req() req: any, @Param() { id }: IdParamDto, @Body() dto: UpdateFormularioDto) {
    return this.service.atualizar(req.user, id, dto);
  }

  @Post(':id/ativar')
  @UseGuards(RolesGuard)
  @Roles('COORDENADOR', 'ADMIN')
  async ativar(@Req() req: any, @Param() { id }: IdParamDto) {
    return this.service.setAtivo(req.user, id, true);
  }

  @Post(':id/inativar')
  @UseGuards(RolesGuard)
  @Roles('COORDENADOR', 'ADMIN')
  async inativar(@Req() req: any, @Param() { id }: IdParamDto) {
    return this.service.setAtivo(req.user, id, false);
  }
}
