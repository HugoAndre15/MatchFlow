import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ClubsModule } from './clubs/clubs.module';
import { MatchesModule } from './matches/matches.module';
import { AuthModule } from './auth/auth.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    // 🔧 Configuration globale des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,              // Disponible dans tous les modules sans réimporter
      envFilePath: '.env',         // Fichier à charger
      validate,                    // Fonction de validation (lance une erreur si invalide)
      cache: true,                 // Cache les variables pour de meilleures performances
    }),
    UsersModule, 
    TeamsModule, 
    PlayersModule, 
    PrismaModule, 
    ClubsModule, 
    MatchesModule, 
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}