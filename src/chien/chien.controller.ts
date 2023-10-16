import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChienService } from './chien.service';
import { CreateChienDto } from './dto/create-chien.dto';
import { UpdateChienDto } from './dto/update-chien.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Roles } from 'src/guard/roles.decorator';

@Controller('chien')
export class ChienController {
  constructor(private readonly chienService: ChienService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  @Post()
  create(@Body() createChienDto: CreateChienDto) {
    return this.chienService.create(createChienDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('superadmin', 'admin', 'soigneur', 'bénévole')
  @Get()
  findAll() {
    return this.chienService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chienService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChienDto: UpdateChienDto) {
    return this.chienService.update(+id, updateChienDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chienService.remove(+id);
  }
}
