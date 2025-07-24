// back/src/match/match.module.ts
import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [MatchController],
  providers: [MatchService, PrismaService],
  exports: [MatchService],
})
export class MatchModule {}