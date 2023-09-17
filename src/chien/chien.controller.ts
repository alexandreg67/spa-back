import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChienService } from './chien.service';
import { CreateChienDto } from './dto/create-chien.dto';
import { UpdateChienDto } from './dto/update-chien.dto';

@Controller('chien')
export class ChienController {
  constructor(private readonly chienService: ChienService) {}

  @Post()
  create(@Body() createChienDto: CreateChienDto) {
    return this.chienService.create(createChienDto);
  }

  @Get()
  findAll() {
    return this.chienService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chienService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChienDto: UpdateChienDto) {
    return this.chienService.update(+id, updateChienDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chienService.remove(+id);
  }
}
