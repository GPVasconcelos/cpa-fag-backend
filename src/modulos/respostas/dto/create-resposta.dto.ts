import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRespostaDto {
  @Type(() => Number)
  @IsInt()
  formularioId: number;

  @Type(() => Number)
  @IsInt()
  perguntaId: number;

  @IsString()
  valor: string; 
}
