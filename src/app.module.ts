import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { RoleModule } from './role/role.module';
import { ChienModule } from './chien/chien.module';
import { CreneauModule } from './creneau/creneau.module';
import { ActiviteModule } from './activite/activite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [],
      synchronize: false,
    }),
    UtilisateurModule,
    RoleModule,
    ChienModule,
    CreneauModule,
    ActiviteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
