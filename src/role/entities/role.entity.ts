import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nom: string;

  @ManyToMany(() => Utilisateur)
  users: Utilisateur[];
}
