import { ApiProperty } from '@nestjs/swagger';
import { StatutUtilisateur } from '../entities/utilisateur.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ChangeStatusDto {
  @ApiProperty({ enum: StatutUtilisateur })
  @IsEnum(StatutUtilisateur)
  @IsNotEmpty()
  status: StatutUtilisateur;
}
