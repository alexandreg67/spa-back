import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Role } from 'src/role/entities/role.entity';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Utilisateur, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '1h' }, // Expire en 1 heure
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, UtilisateurService],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule, JwtAuthGuard],
})
export class AuthModule {}
