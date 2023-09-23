import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { StatutUtilisateur, Utilisateur } from './entities/utilisateur.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeStatusDto } from './dto/change-status.dto';

@Controller('utilisateur')
export class UtilisateurController {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    private readonly utilisateurService: UtilisateurService,
  ) {}

  @Post()
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateurService.create(createUtilisateurDto);
  }

  @Get()
  findAll() {
    return this.utilisateurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilisateurService.findOne(+id);
  }

  @Get('en-attente')
  async getUsersInAttente(): Promise<Utilisateur[]> {
    // Récupérer tous les utilisateurs en attente
    return this.utilisateurRepository.find({
      where: { status: StatutUtilisateur.EN_ATTENTE },
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUtilisateurDto: UpdateUtilisateurDto,
  ) {
    return this.utilisateurService.update(+id, updateUtilisateurDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilisateurService.remove(+id);
  }

  @Patch(':id/status')
  async changeUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.utilisateurService.changeUserStatus(id, changeStatusDto.status);
  }
}
