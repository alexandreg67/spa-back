import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import {
  StatutUtilisateur,
  UserRole,
  Utilisateur,
} from './entities/utilisateur.entity';
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
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  create(createUtilisateurDto: CreateUtilisateurDto) {
    return 'This action adds a new utilisateur';
  }

  findAll() {
    return this.utilisateurRepository.find();
  }

  async findOne(id: number, includeSoftDeleted = false) {
    if (includeSoftDeleted === true) {
      const deleteUser = this.getDeletedUser(id);
      return deleteUser;
    } else {
      const found = await this.utilisateurRepository.findOneBy({ id });
      if (!found) {
        throw new NotFoundException('Utilisateur non trouvé');
      }
      return found;
    }
  }

  async update(
    id: number,
    updateUtilisateurDto: UpdateUtilisateurDto,
  ): Promise<Utilisateur> {
    const utilisateur = await this.utilisateurRepository.findOneBy({ id });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur #${id} not found`);
    }

    // Check if the status is different from 'supprime' and reset the date_suppression
    if (
      updateUtilisateurDto.status &&
      updateUtilisateurDto.status !== 'supprime'
    ) {
      utilisateur.deleted_at = null;
    } else if (updateUtilisateurDto.deleted_at) {
      utilisateur.deleted_at = updateUtilisateurDto.deleted_at;
    }

    // Assuming that updateUtilisateurDto contains fields that match the Utilisateur entity
    Object.assign(utilisateur, updateUtilisateurDto);

    await this.utilisateurRepository.save(utilisateur);

    return utilisateur;
  }

  async getUsersInAttente(): Promise<Utilisateur[]> {
    // Récupérer tous les utilisateurs en attente
    return this.utilisateurRepository.find({
      where: { status: StatutUtilisateur.EN_ATTENTE },
    });
  }

  async getDeletedUsers(): Promise<Utilisateur[]> {
    const users = await this.utilisateurRepository
      .createQueryBuilder('user')
      .where('user.deleted_at IS NOT NULL')
      .withDeleted()
      .getMany();

    if (!users.length) {
      throw new NotFoundException('Aucun utilisateur supprimé');
    }

    return users;
  }

  async getDeletedUser(id: number): Promise<Utilisateur | undefined> {
    const user = await this.utilisateurRepository
      .createQueryBuilder('user')
      .where('user.deleted_at IS NOT NULL')
      .andWhere('user.id = :id', { id: id })
      .withDeleted()
      .getOne();

    return user;
  }

  async changeUserStatus(
    id: number,
    newStatus: StatutUtilisateur,
  ): Promise<Utilisateur> {
    // Récupérer l'utilisateur
    const user = await this.utilisateurRepository.findOne({
      where: { id: id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (!user.roles || user.roles.length === 0) {
      const defaultRole = await this.roleRepository.findOne({
        where: { nom: UserRole.BENEVOLE },
      });
      if (!defaultRole) throw new NotFoundException('Default role not found!');
      user.roles = [defaultRole];
    }

    user.status = newStatus;
    console.log('status modifié', user.status);

    return this.utilisateurRepository.save(user);
  }

  async updateRoles(id: number, roles: UserRole[]): Promise<Utilisateur> {
    // Récupérer l'utilisateur
    const user = await this.utilisateurRepository.findOne({
      where: { id: id },
      // On récupère les roles de l'utilisateur
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    if (roles.length === 0)
      throw new BadRequestException('Au moins un rôle doit être attribué');

    // Vérification si les roles sont bien un tableau
    if (!Array.isArray(roles)) {
      throw new BadRequestException('Roles doit être un tableau');
    }

    // Vérification si les roles sont valides
    const newRoles = await Promise.all(
      // Pour chaque role, on vérifie s'il existe dans la base de données
      roles.map(async (roleEnumValue) => {
        const role = await this.roleRepository.findOne({
          where: { nom: roleEnumValue },
        });

        if (!role) {
          throw new NotFoundException(
            `Role ${roleEnumValue} n'existe pas dans la base de données`,
          );
        }
        return role;
      }),
    );
    // On remplace les anciens roles par les nouveaux
    user.roles = newRoles;

    // On sauvegarde l'utilisateur
    try {
      await this.utilisateurRepository.save(user);
    } catch (error) {
      console.error('Error saving user:', error);
      throw new InternalServerErrorException('Error saving user');
    }
    return user;
  }

  async softDelete(id: number) {
    const user = await this.utilisateurRepository.findOneBy({ id });
    console.log('soft delete user', user);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
    }
    user.status = StatutUtilisateur.SUPPRIME;
    user.deleted_at = new Date();
    await this.utilisateurRepository.save(user);
  }

  async restoreUser(id: number) {
    const user = await this.utilisateurRepository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
    }
    user.deleted_at = null;
    user.status = StatutUtilisateur.APPROUVE;
    return await this.utilisateurRepository.save(user);
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
    const superAdminRole = await this.roleRepository.findOne({
      where: { nom: 'superadmin' },
    });

    if (!superAdminRole) {
      throw new NotFoundException('Rôle SuperAdmin introuvable');
    }
    // Ajoutez le rôle SuperAdmin à l'utilisateur
    newUser.roles = [superAdminRole];
    await this.utilisateurRepository.save(newUser);
    return { message: 'SuperAdmin créé avec succès' };
  }
}
