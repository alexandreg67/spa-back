import { Module } from '@nestjs/common';
import { ChienService } from './chien.service';
import { ChienController } from './chien.controller';

@Module({
  controllers: [ChienController],
  providers: [ChienService],
})
export class ChienModule {}
