// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from 'src/modulos/usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: any) {
    const user = await this.usuariosService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      userId: user.id,
      email: user.email,
      tipoUsuario: user.tipo,
      cursoId: user.cursoId ?? null,
      turmaId: user.turmaId ?? null,
    };
  }
}