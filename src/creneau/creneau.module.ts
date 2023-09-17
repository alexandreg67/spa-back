import { Module } from '@nestjs/common';
import { CreneauService } from './creneau.service';
import { CreneauController } from './creneau.controller';

@Module({
  controllers: [CreneauController],
  providers: [CreneauService],
})
export class CreneauModule {}
