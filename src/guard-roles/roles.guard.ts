import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector est une classe qui permet de récupérer les métadonnées d'une route
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupérer les rôles définis sur la route
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    // Si aucun rôle n'est requis pour accéder à la route, on autorise l'accès
    if (!roles) return true;
    // Récupérer la requête
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // some() permet de vérifier si au moins un élément du tableau passe le test implémenté par la fonction fournie.
    return user.roles.some((role) => roles.includes(role));
  }
}
