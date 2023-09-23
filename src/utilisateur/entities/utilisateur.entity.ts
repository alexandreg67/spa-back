import { Role } from 'src/role/entities/role.entity';
import { UtilisateurChien } from 'src/utilisateur_chien/entities/utilisateur_chien.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StatutUtilisateur {
  EN_ATTENTE = 'en_attente',
  APPROUVE = 'approuve',
  REJETE = 'rejete',
}
@Entity('utilisateur')
export class Utilisateur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nom: string;

  @Column({ type: 'varchar', length: 255 })
  prenom: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  mot_de_passe: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telephone: string;

  @Column({
    type: 'enum',
    enum: StatutUtilisateur,
    default: StatutUtilisateur.EN_ATTENTE,
  })
  status: StatutUtilisateur;

  @CreateDateColumn({ type: 'timestamp' })
  date_inscription: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'utilisateur_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @OneToMany(
    () => UtilisateurChien,
    (utilisateurChien) => utilisateurChien.utilisateur,
  )
  interactionsChien: UtilisateurChien[];
}
