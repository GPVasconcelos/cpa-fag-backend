import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FormulariosController } from './formularios.controller';
import { FormulariosService } from './formularios.service';
import { AuditModule } from 'src/common/audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [FormulariosController],
  providers: [FormulariosService],
})
export class FormulariosModule {}