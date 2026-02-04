import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ClubsModule } from './clubs/clubs.module';

@Module({
  imports: [UsersModule, TeamsModule, PlayersModule, PrismaModule, ClubsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}