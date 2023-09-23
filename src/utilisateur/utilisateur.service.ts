import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { StatutUtilisateur, Utilisateur } from './entities/utilisateur.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupDto } from 'src/auth/dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    @InjectRepository(Utilisateur)
    private roleRepository: Repository<Role>,
  ) {}
  create(createUtilisateurDto: CreateUtilisateurDto) {
    return 'This action adds a new utilisateur';
  }

  findAll() {
    return `This action returns all utilisateur`;
  }

  findOne(id: number) {
    return `This action returns a #${id} utilisateur`;
  }

  update(id: number, updateUtilisateurDto: UpdateUtilisateurDto) {
    return `This action updates a #${id} utilisateur`;
  }

  remove(id: number) {
    return `This action removes a #${id} utilisateur`;
  }

  async getUsersInAttente(): Promise<Utilisateur[]> {
    // Récupérer tous les utilisateurs en attente
    return this.utilisateurRepository.find({
      where: { status: StatutUtilisateur.EN_ATTENTE },
    });
  }

  async changeUserStatus(
    id: number,
    newStatus: StatutUtilisateur,
  ): Promise<Utilisateur> {
    const user = await this.utilisateurRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    user.status = newStatus;
    console.log('status modifié', user.status);

    return this.utilisateurRepository.save(user);
  }

  async createSuperAdmin(signupDto: SignupDto): Promise<any> {
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

    // Hardcoder le rôle en tant que "SuperAdmin"
    const superAdminRole = await this.roleRepository.findOneBy({
      nom: 'superadmin',
    });

    if (!superAdminRole) {
      throw new NotFoundException('Rôle SuperAdmin introuvable');
    }

    newUser.roles = [superAdminRole]; // Ajoutez le rôle SuperAdmin à l'utilisateur
    await this.utilisateurRepository.save(newUser);
    return { message: 'SuperAdmin créé avec succès' };
  }
}
