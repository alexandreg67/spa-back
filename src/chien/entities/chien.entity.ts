import { Creneau } from 'src/creneau/entities/creneau.entity';
import { UtilisateurChien } from 'src/utilisateur_chien/entities/utilisateur_chien.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DifficulteChien {
  FACILE = 1,
  MOYEN = 2,
  DIFFICILE = 3,
}

@Entity('chien')
export class Chien {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  race: string;

  @Column({ nullable: true })
  age: number;

  @Column({
    type: 'enum',
    enum: DifficulteChien,
  })
  difficulte: DifficulteChien;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToMany(() => Creneau)
  @JoinTable({
    name: 'chien_creneau',
    joinColumn: { name: 'chien_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'creneau_id', referencedColumnName: 'id' },
  })
  creneaux: Creneau[];

  @OneToMany(
    () => UtilisateurChien,
    (utilisateurChien) => utilisateurChien.chien,
  )
  interactionsUtilisateur: UtilisateurChien[];
}
