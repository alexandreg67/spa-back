import { Activite } from 'src/activite/entities/activite.entity';
import { Chien } from 'src/chien/entities/chien.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Creneau')
export class Creneau {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  date_debut: Date;

  @Column('timestamp')
  date_fin: Date;

  @Column({ default: 'libre' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToMany(() => Chien, (chien) => chien.creneaux)
  chiens: Chien[];

  @ManyToMany(() => Activite)
  @JoinTable({
    name: 'Creneau_Activite',
    joinColumn: { name: 'creneau_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'activite_id', referencedColumnName: 'id' },
  })
  activites: Activite[];
}
