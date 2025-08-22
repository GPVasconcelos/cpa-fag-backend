import { IsBoolean, IsDateString, IsIn, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

const FORM_SCOPE = ['CURSO', 'INSTITUCIONAL'] as const;
export type FormScopeDto = typeof FORM_SCOPE[number];

export class CreateFormularioDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsIn(FORM_SCOPE)
  escopo: FormScopeDto;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cursoId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  turmaId?: number | null; 
  
  @IsOptional()
  @IsBoolean()
  anonimo?: boolean;

  @IsOptional()
  @IsDateString()
  inicioEm?: string;

  @IsOptional()
  @IsDateString()
  fimEm?: string;
}
