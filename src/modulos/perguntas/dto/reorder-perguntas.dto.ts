import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Item {
  @Type(() => Number)
  @IsInt()
  id: number;

  @Type(() => Number)
  @IsInt()
  ordem: number;
}

export class ReorderPerguntasDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  itens: Item[];
}