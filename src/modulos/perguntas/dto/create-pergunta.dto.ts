import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePerguntaDto {
  @Type(() => Number)
  @IsInt()
  formularioId: number;

  @IsString()
  tipo: string; // 'texto' | 'radio' | 'checkbox' | 'escala' | ...

  @IsString()
  enunciado: string;

  @IsOptional()
  @IsBoolean()
  obrigatoria?: boolean;

  // JSON livre para opções de resposta, ranges, etc.
  @IsOptional()
  configuracao?: any;
}
