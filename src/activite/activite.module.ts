import { Module } from '@nestjs/common';
import { ActiviteService } from './activite.service';
import { ActiviteController } from './activite.controller';

@Module({
  controllers: [ActiviteController],
  providers: [ActiviteService],
})
export class ActiviteModule {}
