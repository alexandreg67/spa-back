import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChienDto } from './dto/create-chien.dto';
import { UpdateChienDto } from './dto/update-chien.dto';
import { Chien } from './entities/chien.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChienService {
  constructor(
    @InjectRepository(Chien)
    private chienRepository: Repository<Chien>,
  ) {}

  async create(createChienDto: CreateChienDto) {
    const { nom, age, race, difficulte } = createChienDto;

    // Créer un nouveau chien
    const newChien = this.chienRepository.create({
      nom,
      age,
      race,
      difficulte,
    });

    // Enregistrer le chien dans la base de données
    await this.chienRepository.save(newChien);

    return { message: 'Nouveau chien ajouté' };
  }

  findAll() {
    return this.chienRepository.find();
  }

  async findOne(id: number) {
    const chien = await this.chienRepository.findOneBy({ id });
    if (!chien) {
      throw new NotFoundException('Chien non trouvé');
    }
    return chien;
  }

  async update(id: number, updateChienDto: UpdateChienDto) {
    const chien = await this.findOne(id);

    return `This action updates a #${id} chien`;
  }

  remove(id: number) {
    return `This action removes a #${id} chien`;
  }
}
