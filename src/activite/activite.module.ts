import { Module } from '@nestjs/common';
import { ActiviteService } from './activite.service';
import { ActiviteController } from './activite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activite } from './entities/activite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activite])],
  controllers: [ActiviteController],
  providers: [ActiviteService],
})
export class ActiviteModule {}
