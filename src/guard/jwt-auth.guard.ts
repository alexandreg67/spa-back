import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { StatutUtilisateur } from 'src/utilisateur/entities/utilisateur.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtStrategy: JwtStrategy,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Récupération de la requête
    const request = context.switchToHttp().getRequest();

    // Récupération du token dans le header de la requête
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (!token) {
      throw new UnauthorizedException('Aucun token fourni');
    }

    console.log('Token à décoder:', token);

    // Décodage du token pour obtenir le payload
    let payload: any;
    try {
      payload = this.jwtService.decode(token);
    } catch (err) {
      throw new UnauthorizedException(
        'Erreur lors du décodage du token : ' + err.message,
      );
    }

    console.log('Payload décodé:', payload);

    if (!payload) {
      throw new UnauthorizedException('Token invalide, payload est vide.');
    }
    if (!payload.userId) {
      throw new UnauthorizedException('Token invalide, userId manquant.');
    }
    if (!Array.isArray(payload.roles)) {
      throw new UnauthorizedException(
        "Token invalide, roles n'est pas un tableau.",
      );
    }

    // Vérification de la validité du token
    const user = await this.jwtStrategy.validate({ userId: payload.userId });
    if (!user) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    request.user = user;

    // Vérification du statut de l'utilisateur
    if (user.status === StatutUtilisateur.EN_ATTENTE) {
      throw new ForbiddenException(
        "Votre compte n'est pas encore approuvé par un administrateur",
      );
    }
    if (user.status === StatutUtilisateur.SUPPRIME) {
      throw new ForbiddenException('Votre compte a été supprimé');
    }

    // Vérification des rôles
    const rolesRequired = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    // Si la route n'a pas de rôles requis, on autorise l'accès
    if (rolesRequired && rolesRequired.length) {
      // some() retourne true si au moins un élément du tableau passe le test
      const hasRequiredRole = rolesRequired.some((role) =>
        payload.roles.includes(role),
      );
      // Si l'utilisateur n'a pas le rôle requis, on lève une exception
      if (!hasRequiredRole) {
        throw new ForbiddenException(
          "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
        );
      }
    }
    return true;
  }
}
