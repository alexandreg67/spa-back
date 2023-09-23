import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtStrategy: JwtStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Récupérer la requête
    const request = context.switchToHttp().getRequest();

    // Récupérez le token de la requête.
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    // Si aucun token n'est fourni, lancez une exception.
    if (!token) {
      throw new UnauthorizedException('Aucun token fourni');
    }

    // Valider le token avec JwtStrategy
    const user = await this.jwtStrategy.validate({
      jwtPayload: { email: token },
    });

    // Si le token n'est pas valide, lancez une exception.
    if (!user) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    // Attache l'utilisateur décodé à la requête, pour que les prochains gardes ou le gestionnaire puisse l'utiliser.
    request.user = user;
    return true;
  }
}
