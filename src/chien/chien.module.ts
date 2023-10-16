import { Module } from '@nestjs/common';
import { ChienService } from './chien.service';
import { ChienController } from './chien.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chien } from './entities/chien.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Chien])],
  controllers: [ChienController],
  providers: [ChienService, JwtService],
})
export class ChienModule {}
