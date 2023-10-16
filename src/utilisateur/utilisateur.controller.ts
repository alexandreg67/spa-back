import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { Utilisateur } from './entities/utilisateur.entity';
import { ChangeStatusDto } from './dto/change-status.dto';
import { instanceToPlain } from 'class-transformer';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Roles } from 'src/guard/roles.decorator';
import { UpdateRoleDto } from 'src/role/dto/update-role.dto';
@Controller('utilisateur')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Post()
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateurService.create(createUtilisateurDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  @Post(':id/restore')
  async restoreUser(@Param('id') id: string) {
    await this.utilisateurService.restoreUser(+id);
    return { message: 'Utilisateur restauré avec succès' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  @Get()
  async findAll() {
    return await this.utilisateurService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.utilisateurService.findOne(+id);
    return instanceToPlain(user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  @Get('en-attente')
  async getUsersInAttente(): Promise<Utilisateur[]> {
    // Récupérer tous les utilisateurs en attente
    return this.utilisateurService.getUsersInAttente();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUtilisateurDto: UpdateUtilisateurDto,
  ) {
    return this.utilisateurService.update(+id, updateUtilisateurDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  @Delete(':id')
  softDeleteUser(@Param('id') id: string) {
    return this.utilisateurService.softDelete(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  @Get('/deleted-users')
  async getDeletedUsers(): Promise<Utilisateur[]> {
    return this.utilisateurService.getDeletedUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  @Patch(':id/status')
  async changeUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.utilisateurService.changeUserStatus(id, changeStatusDto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  @Patch(':id/roles')
  async updateRoles(
    @Param('id') id: string,
    @Body() updateRolesDto: UpdateRoleDto,
  ) {
    console.log('controller updateRoles', updateRolesDto);
    return this.utilisateurService.updateRoles(+id, updateRolesDto.roles);
  }

  // @Get('userRoles')
  // getUserRoles(): UserRole[] {
  //   return Object.values(UserRole);
  // }

  // @Get('userStatuses')
  // getUserStatuses(): StatutUtilisateur[] {
  //   return Object.values(StatutUtilisateur);
  // }

  @Post('/create-superadmin')
  async createSuperAdmin(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateurService.createSuperAdmin(createUtilisateurDto);
  }
}
