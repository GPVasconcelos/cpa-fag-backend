import { IsInt, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRespostaDto {
  
  @IsInt()
  formularioId: number;

  @IsInt()
  perguntaId: number;

  @IsDefined()
  valor: any;
}
