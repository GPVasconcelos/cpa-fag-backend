import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from 'src/modulos/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const user = await this.usuariosService.findByEmail(email);
    if (!user?.senha) throw new UnauthorizedException('Credenciais inválidas.');

    const ok = await bcrypt.compare(senha, user.senha);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas.');

    const { senha: _omit, ...safeUser } = user as any;

    const payload = {
      sub: safeUser.id,
      tipoUsuario: safeUser.tipo,
      cursoId: safeUser.cursoId ?? null,
      turmaId: safeUser.turmaId ?? null,
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}
