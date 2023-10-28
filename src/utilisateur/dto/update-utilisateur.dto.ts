import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUtilisateurDto } from './create-utilisateur.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatutUtilisateur } from '../entities/utilisateur.entity';
import { UserRole } from '../entities/utilisateur.entity';

export class UpdateUtilisateurDto extends PartialType(CreateUtilisateurDto) {
  @ApiProperty({ enum: StatutUtilisateur })
  @IsEnum(StatutUtilisateur)
  @IsNotEmpty()
  status: StatutUtilisateur;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole, { each: true })
  @IsNotEmpty()
  roles: UserRole[];

  @ApiProperty({ required: false })
  deleted_at?: Date;
}
