import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { DifficulteChien } from '../entities/chien.entity';

export class CreateChienDto {
  @IsString()
  nom: string;

  @IsString()
  @IsOptional()
  race?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsEnum(DifficulteChien)
  difficulte: DifficulteChien;
}
