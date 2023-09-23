import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector est une classe qui permet de récupérer les métadonnées d'une route
  constructor(private reflector: Reflector) {}
  // ExecutionContext est une classe qui permet de récupérer la requête
  canActivate(context: ExecutionContext): boolean {
    // Récupérer les rôles définis sur la route
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    // Si aucun rôle n'est requis pour accéder à la route, on autorise l'accès
    if (!roles) return true;

    // Récupérer la requête
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Vérification si l'utilisateur est défini
    if (!user) {
      throw new UnauthorizedException('Aucun utilisateur connecté.');
    }

    // Vérifier si l'utilisateur a le rôle requis
    // some() est une méthode qui permet de vérifier si au moins un élément du tableau vérifie la condition
    const hasRole =
      user.roles && user.roles.some((role) => roles.includes(role));

    if (!hasRole) {
      // Si l'utilisateur n'a pas le rôle requis, on lance une ForbiddenException.
      throw new ForbiddenException(
        "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
      );
    }

    return hasRole;
  }
}
