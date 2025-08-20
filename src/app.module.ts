import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './modulos/usuarios/usuarios.module';
import { FormulariosModule } from './modulos/formularios/formularios.module';
import { RespostasModule } from './modulos/respostas/respostas.module';
import { CursosModule } from './modulos/cursos/cursos.module';

@Module({
  imports: [UsuariosModule, FormulariosModule, RespostasModule, CursosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
