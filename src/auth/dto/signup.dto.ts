import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  nom: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  prenom: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  telephone: string | null;

  @ApiProperty()
  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  mot_de_passe: string;
}
