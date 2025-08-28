import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePerguntaDto {
  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  enunciado?: string;

  @IsOptional()
  @IsBoolean()
  obrigatoria?: boolean;

  // JSON livre
  @IsOptional()
  configuracao?: any;
}
