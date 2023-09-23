import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUtilisateurDto } from './create-utilisateur.dto';
import { IsEnum, IsString } from 'class-validator';
import { StatutUtilisateur } from '../entities/utilisateur.entity';

export class UpdateUtilisateurDto extends PartialType(CreateUtilisateurDto) {
  @ApiProperty({ enum: StatutUtilisateur })
  @IsEnum(StatutUtilisateur)
  status: StatutUtilisateur;
}
