import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
  ) {
    super({
      secretOrKey: process.env.SECRET_JWT,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // IMPORTANT IL FAUT GARDER CE NOM DE METHODE
  async validate(payload: any): Promise<Utilisateur> {
    console.log('validate');
    console.log('payload', payload);

    const { userId } = payload;

    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    console.log('utilisateur', utilisateur);

    if (!utilisateur) throw new UnauthorizedException();
    return utilisateur;
  }
}
