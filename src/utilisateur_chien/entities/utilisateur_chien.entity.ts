import { Chien } from 'src/chien/entities/chien.entity';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('utilisateur_chien')
export class UtilisateurChien {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_interaction: Date;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.interactionsChien)
  @JoinColumn({ name: 'user_id' })
  utilisateur: Utilisateur;

  @ManyToOne(() => Chien, (chien) => chien.interactionsUtilisateur)
  @JoinColumn({ name: 'chien_id' })
  chien: Chien;
}
