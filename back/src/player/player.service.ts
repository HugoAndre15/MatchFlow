// back/src/player/player.service.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlayerDto, UpdatePlayerDto } from './dto/player.dto';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPlayerDto: CreatePlayerDto) {
    const { teamId, number, ...playerData } = createPlayerDto;

    // Vérifier que l'équipe appartient à l'utilisateur
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { _count: { select: { players: true } } },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    if (team.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé à cette équipe');
    }

    // Vérifier la limite de 25 joueurs pour la version gratuite
    if (team._count.players >= 25) {
      throw new ForbiddenException('Limite de 25 joueurs atteinte pour la version gratuite');
    }

    // Vérifier que le numéro n'est pas déjà pris
    const existingPlayer = await this.prisma.player.findUnique({
      where: {
        teamId_number: {
          teamId,
          number,
        },
      },
    });

    if (existingPlayer) {
      throw new ConflictException(`Le numéro ${number} est déjà attribué dans cette équipe`);
    }

    return this.prisma.player.create({
      data: {
        ...playerData,
        number,
        teamId,
      },
      include: {
        goals: true,
        assists: true,
        cards: true,
        matchPlayers: {
          include: {
            match: true,
          },
        },
      },
    });
  }

  async findAll(teamId: string, userId: string) {
    // Vérifier que l'équipe appartient à l'utilisateur
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team || team.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé à cette équipe');
    }

    return this.prisma.player.findMany({
      where: { teamId },
      orderBy: { number: 'asc' },
      include: {
        goals: true,
        assists: true,
        cards: true,
        matchPlayers: {
          include: {
            match: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
      include: {
        team: true,
        goals: {
          include: { match: true },
          orderBy: { createdAt: 'desc' },
        },
        assists: {
          include: { match: true },
          orderBy: { createdAt: 'desc' },
        },
        cards: {
          include: { match: true },
          orderBy: { createdAt: 'desc' },
        },
        matchPlayers: {
          include: {
            match: true,
          },
          orderBy: {
            match: { date: 'desc' },
          },
        },
      },
    });

    if (!player) {
      throw new NotFoundException('Joueur non trouvé');
    }

    if (player.team.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé à ce joueur');
    }

    return player;
  }

  async update(id: string, userId: string, updatePlayerDto: UpdatePlayerDto) {
    const player = await this.findOne(id, userId);

    // Si on change le numéro, vérifier qu'il n'est pas déjà pris
    if (updatePlayerDto.number && updatePlayerDto.number !== player.number) {
      const existingPlayer = await this.prisma.player.findUnique({
        where: {
          teamId_number: {
            teamId: player.teamId,
            number: updatePlayerDto.number,
          },
        },
      });

      if (existingPlayer) {
        throw new ConflictException(`Le numéro ${updatePlayerDto.number} est déjà attribué dans cette équipe`);
      }
    }

    return this.prisma.player.update({
      where: { id },
      data: updatePlayerDto,
      include: {
        goals: true,
        assists: true,
        cards: true,
        matchPlayers: {
          include: {
            match: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const player = await this.findOne(id, userId);

    return this.prisma.player.delete({
      where: { id },
    });
  }

  async getPlayerStats(id: string, userId: string) {
    const player = await this.findOne(id, userId);

    const matches = await this.prisma.matchPlayer.findMany({
      where: { playerId: id },
      include: { match: true },
    });

    const totalMatches = matches.length;
    const totalMinutes = matches.reduce((sum, mp) => sum + mp.minutesPlayed, 0);
    const starterMatches = matches.filter(mp => mp.isStarter).length;

    return {
      totalMatches,
      starterMatches,
      substituteMatches: totalMatches - starterMatches,
      totalMinutes,
      averageMinutesPerMatch: totalMatches > 0 ? Math.round(totalMinutes / totalMatches) : 0,
      totalGoals: player.goals.length,
      totalAssists: player.assists.length,
      totalCards: player.cards.length,
      yellowCards: player.cards.filter(c => c.type === 'YELLOW').length,
      redCards: player.cards.filter(c => c.type === 'RED').length,
      goalsPerMatch: totalMatches > 0 ? +(player.goals.length / totalMatches).toFixed(2) : 0,
      assistsPerMatch: totalMatches > 0 ? +(player.assists.length / totalMatches).toFixed(2) : 0,
    };
  }
}