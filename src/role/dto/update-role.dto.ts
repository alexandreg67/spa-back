import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/utilisateur/entities/utilisateur.entity';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsArray()
  @IsNotEmpty()
  // each: true permet de vérifier que chaque élément du tableau est bien une valeur de l'enum UserRole
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];
}
