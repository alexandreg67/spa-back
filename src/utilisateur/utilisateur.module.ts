import { Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from './entities/utilisateur.entity';
import { Role } from 'src/role/entities/role.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur, Role]), AuthModule],
  controllers: [UtilisateurController],
  providers: [UtilisateurService],
})
export class UtilisateurModule {}
