import { Injectable } from '@nestjs/common';
import { CreateChienDto } from './dto/create-chien.dto';
import { UpdateChienDto } from './dto/update-chien.dto';

@Injectable()
export class ChienService {
  create(createChienDto: CreateChienDto) {
    return 'This action adds a new chien';
  }

  findAll() {
    return `This action returns all chien`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chien`;
  }

  update(id: number, updateChienDto: UpdateChienDto) {
    return `This action updates a #${id} chien`;
  }

  remove(id: number) {
    return `This action removes a #${id} chien`;
  }
}
