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

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtStrategy: JwtStrategy,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Récupération du token dans le header de la requête
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (!token) {
      throw new UnauthorizedException('Aucun token fourni');
    }

    // Décodage du token pour obtenir le payload
    const payload: any = this.jwtService.decode(token);
    if (!payload || !payload.userId || !Array.isArray(payload.roles)) {
      throw new UnauthorizedException('Token invalide');
    }

    const user = await this.jwtStrategy.validate({ userId: payload.userId });
    if (!user) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    request.user = user;

    // Vérification des rôles
    const rolesRequired = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (rolesRequired && rolesRequired.length) {
      const hasRequiredRole = rolesRequired.some((role) =>
        payload.roles.includes(role),
      );
      if (!hasRequiredRole) {
        throw new ForbiddenException(
          "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
        );
      }
    }
    return true;
  }
}
