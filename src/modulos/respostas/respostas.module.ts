import { Module } from '@nestjs/common';
import { RespostasController } from './respostas.controller';
import { RespostasService } from './respostas.service';

@Module({
  controllers: [RespostasController],
  providers: [RespostasService]
})
export class RespostasModule {}
