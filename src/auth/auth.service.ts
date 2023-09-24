import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, mot_de_passe } = loginDto;
    const user = await this.utilisateurRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    if (await bcrypt.compare(mot_de_passe, user.mot_de_passe)) {
      const payload = {
        email: user.email,
        userId: user.id,
        roles: user.roles.map((role) => role.nom),
      };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Identifiants incorrects');
    }
  }

  async signUp(signupDto: SignupDto): Promise<any> {
    const { nom, prenom, email, telephone, mot_de_passe } = signupDto;

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    // Créer un nouvel utilisateur
    const newUser = this.utilisateurRepository.create({
      nom,
      prenom,
      email,
      telephone,
      mot_de_passe: hashedPassword,
    });

    // Vérifiez si l'utilisateur existe déjà dans la base de données
    const userExists = await this.utilisateurRepository.findOneBy({ email });
    if (userExists) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    await this.utilisateurRepository.save(newUser);

    // Ici, on peut renvoyer un token JWT pour que l'utilisateur soit connecté directement
    // On peut aussi renvoyez une confirmation ou les données de l'utilisateur
    return { message: 'Inscription réussie' };
  }
}
