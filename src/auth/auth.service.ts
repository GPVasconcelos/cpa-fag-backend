// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/modulos/usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usuariosService.findByEmail(email);

    // Compara a senha fornecida com o hash armazenado no banco
    if (user && (await bcrypt.compare(pass, user.senha))) {
      const { senha, ...result } = user; // Remove a senha do objeto de retorno
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id, // 'sub' (subject) é a convenção para o ID do usuário
      email: user.email,
      tipoUsuario: user.tipo,
      cursoId: user.cursoId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
