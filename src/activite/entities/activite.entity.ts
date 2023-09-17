import { Creneau } from 'src/creneau/entities/creneau.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Activite')
export class Activite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  description: string;

  @ManyToMany(() => Creneau, (creneau) => creneau.activites)
  creneaux: Creneau[];
}
