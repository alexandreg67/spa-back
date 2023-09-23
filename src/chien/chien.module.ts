import { Module } from '@nestjs/common';
import { ChienService } from './chien.service';
import { ChienController } from './chien.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chien } from './entities/chien.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chien])],
  controllers: [ChienController],
  providers: [ChienService],
})
export class ChienModule {}
