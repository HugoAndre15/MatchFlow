// back/src/team/team.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTeamDto: CreateTeamDto) {
    // Vérifier la limite de 3 équipes pour la version gratuite
    const userTeamsCount = await this.prisma.team.count({
      where: { userId },
    });

    if (userTeamsCount >= 3) {
      throw new ForbiddenException('Limite de 3 équipes atteinte pour la version gratuite');
    }

    return this.prisma.team.create({
      data: {
        ...createTeamDto,
        userId,
      },
      include: {
        players: true,
        matches: {
          orderBy: { date: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            players: true,
            matches: true,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.team.findMany({
      where: { userId },
      include: {
        players: {
          where: { status: 'ACTIVE' },
          orderBy: { number: 'asc' },
        },
        matches: {
          orderBy: { date: 'desc' },
          take: 3,
        },
        _count: {
          select: {
            players: true,
            matches: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        players: {
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
        },
        matches: {
          orderBy: { date: 'desc' },
          include: {
            goals: {
              include: { player: true },
            },
            assists: {
              include: { player: true },
            },
            cards: {
              include: { player: true },
            },
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    if (team.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé à cette équipe');
    }

    return team;
  }

  async update(id: string, userId: string, updateTeamDto: UpdateTeamDto) {
    const team = await this.findOne(id, userId);

    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
      include: {
        players: true,
        matches: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const team = await this.findOne(id, userId);

    return this.prisma.team.delete({
      where: { id },
    });
  }

  async getTeamStats(id: string, userId: string) {
    const team = await this.findOne(id, userId);

    const matches = await this.prisma.match.findMany({
      where: { teamId: id, status: 'FINISHED' },
      include: {
        goals: true,
        assists: true,
        cards: true,
      },
    });

    const totalMatches = matches.length;
    const wins = matches.filter(m => m.ourScore > m.opponentScore).length;
    const draws = matches.filter(m => m.ourScore === m.opponentScore).length;
    const losses = matches.filter(m => m.ourScore < m.opponentScore).length;
    const totalGoals = matches.reduce((sum, m) => sum + m.ourScore, 0);
    const totalGoalsConceded = matches.reduce((sum, m) => sum + m.opponentScore, 0);

    return {
      totalMatches,
      wins,
      draws,
      losses,
      winPercentage: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0,
      totalGoals,
      totalGoalsConceded,
      goalDifference: totalGoals - totalGoalsConceded,
      averageGoalsPerMatch: totalMatches > 0 ? +(totalGoals / totalMatches).toFixed(2) : 0,
    };
  }
}