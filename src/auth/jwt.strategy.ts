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

  // Este método é chamado pelo Passport após verificar a assinatura do token.
  // O 'payload' é o mesmo que definimos na função login().
  async validate(payload: any) {
    // Aqui, podemos enriquecer o objeto 'request.user' com mais dados do banco, se necessário.
    const user = await this.usuariosService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    // O objeto retornado aqui será anexado ao objeto Request (ex: req.user)
    return user;
  }
}
