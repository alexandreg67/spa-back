import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // IMPORTANT IL FAUT GARDER CE NOM DE CLASSE
  constructor(
    @InjectRepository(Utilisateur)
    private userRepository: Repository<Utilisateur>,
  ) {
    super({
      secretOrKey: process.env.SECRET_JWT,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // IMPORTANT IL FAUT GARDER CE NOM DE METHODE
  async validate(payload: any): Promise<Utilisateur> {
    console.log('validate');
    const { email } = payload;
    const user: Utilisateur = await this.userRepository.findOneBy({ email });

    if (!user) throw new UnauthorizedException();
    return user;
  }
}
