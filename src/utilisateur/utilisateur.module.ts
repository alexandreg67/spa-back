import { Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from './entities/utilisateur.entity';
import { Role } from 'src/role/entities/role.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Utilisateur, Role])],
  controllers: [UtilisateurController],
  providers: [UtilisateurService, JwtService],
})
export class UtilisateurModule {}
