import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateRespostaDto } from './dto/create-resposta.dto';
import { RespostasService } from './respostas.service';

@Controller('respostas')
@UseGuards(JwtAuthGuard)
export class RespostasController {
  constructor(private readonly service: RespostasService) {}

  @Post()
  async criar(@Req() req: any, @Body() dto: CreateRespostaDto) {
    return this.service.criar(req.user, dto);
  }
}
