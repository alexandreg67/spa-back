import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nom: string;

  @ManyToMany(() => Utilisateur, (utilisateur) => utilisateur.roles)
  users: Utilisateur[];
}
