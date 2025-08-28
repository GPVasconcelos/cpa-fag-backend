import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './modulos/usuarios/usuarios.module';
import { FormulariosModule } from './modulos/formularios/formularios.module';
import { RespostasModule } from './modulos/respostas/respostas.module';
import { HealthModule } from './health/health.module';
import { PerguntasModule } from './modulos/perguntas/perguntas.module';
import { AuditModule } from './common/audit/audit.module';

@Module({
  imports: [
    PrismaModule,
    UsuariosModule,
    AuthModule,
    FormulariosModule,
    PerguntasModule,
    RespostasModule,
    AuditModule,
    HealthModule,
  ],
})
export class AppModule {}
