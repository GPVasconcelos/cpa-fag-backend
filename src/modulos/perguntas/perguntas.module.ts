import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PerguntasController } from './perguntas.controller';
import { PerguntasService } from './perguntas.service';
import { AuditModule } from 'src/common/audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [PerguntasController],
  providers: [PerguntasService],
})
export class PerguntasModule {}