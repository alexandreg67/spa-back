import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
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
  telephone: string;

  @ApiProperty()
  @IsString()
  @MaxLength(60)
  @MinLength(8)
  @IsNotEmpty()
  mot_de_passe: string;
}
