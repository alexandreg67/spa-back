import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateurChien } from './entities/utilisateur_chien.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UtilisateurChien])],
  controllers: [],
  providers: [],
})
export class UtilisateurChienModule {}
