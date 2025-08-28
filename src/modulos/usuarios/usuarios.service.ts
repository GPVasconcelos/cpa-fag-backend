// src/modulos/usuarios/usuarios.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

async findByEmail(email: string) {
  if (!email) {
    throw new Error('Email não fornecido para findByEmail');
  }

  return this.prisma.usuario.findUnique({
    where: { email },
  });
}

  async findById(id: number) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }


}
