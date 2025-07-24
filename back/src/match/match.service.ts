// back/src/match/match.service.ts
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { 
  CreateMatchDto, 
  UpdateMatchDto, 
  MatchCompositionDto, 
  AddGoalDto, 
  AddAssistDto, 
  AddCardDto, 
  AddSubstitutionDto 
} from './dto/match.dto';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createMatchDto: CreateMatchDto) {
    const { teamId, ...matchData } = createMatchDto;

    // Vérifier que l'équipe appartient à l'utilisateur
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team || team.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé à cette équipe');
    }

    return this.prisma.match.create({
      data: {
        ...matchData,
        teamId,
      },
      include: {
        team: true,
        matchPlayers: {
          include: { player: true },
        },
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

    return this.prisma.match.findMany({
      where: { teamId },
      orderBy: { date: 'desc' },
      include: {
        team: true,
        matchPlayers: {
          include: { player: true },
        },
        goals: {
          include: { player: true },
        },
        assists: {
          include: { player: true },
        },
        cards: {
          include: { player: true },
        },
        _count: {
          select: {
            goals: true,
            assists: true,
            cards: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        team: true,
        matchPlayers: {
          include: { player: true },
          orderBy: { player: { number: 'asc' } },
        },
        goals: {
          include: { player: true },
          orderBy: { minute: 'asc' },
        },
        assists: {
          include: { player: true },
          orderBy: { minute: 'asc' },
        },
        cards: {
          include: { player: true },
          orderBy: { minute: 'asc' },
        },
        substitutions: {
          include: {
            playerIn: { include: { player: true } },
            playerOut: { include: { player: true } },
          },
          orderBy: { minute: 'asc' },
        },
      },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    if (match.team.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé à ce match');
    }

    return match;
  }

  async update(id: string, userId: string, updateMatchDto: UpdateMatchDto) {
    const match = await this.findOne(id, userId);

    return this.prisma.match.update({
      where: { id },
      data: updateMatchDto,
      include: {
        team: true,
        matchPlayers: {
          include: { player: true },
        },
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
    });
  }

  async remove(id: string, userId: string) {
    const match = await this.findOne(id, userId);

    return this.prisma.match.delete({
      where: { id },
    });
  }

  async setComposition(userId: string, compositionDto: MatchCompositionDto) {
    const { matchId, starters, substitutes } = compositionDto;
    const match = await this.findOne(matchId, userId);

    if (match.status !== 'SCHEDULED') {
      throw new BadRequestException('Impossible de modifier la composition d\'un match déjà commencé');
    }

    if (starters.length !== 11) {
      throw new BadRequestException('Une équipe doit avoir exactement 11 titulaires');
    }

    if (substitutes.length > 7) {
      throw new BadRequestException('Maximum 7 remplaçants autorisés');
    }

    // Supprimer l'ancienne composition
    await this.prisma.matchPlayer.deleteMany({
      where: { matchId },
    });

    // Ajouter les titulaires
    const starterPromises = starters.map(starter =>
      this.prisma.matchPlayer.create({
        data: {
          matchId,
          playerId: starter.playerId,
          position: starter.position,
          isStarter: true,
        },
      })
    );

    // Ajouter les remplaçants
    const substitutePromises = substitutes.map(substitute =>
      this.prisma.matchPlayer.create({
        data: {
          matchId,
          playerId: substitute.playerId,
          position: 'SUBSTITUTE',
          isStarter: false,
        },
      })
    );

    await Promise.all([...starterPromises, ...substitutePromises]);

    return this.findOne(matchId, userId);
  }

  async startMatch(id: string, userId: string) {
    const match = await this.findOne(id, userId);

    if (match.status !== 'SCHEDULED') {
      throw new BadRequestException('Le match ne peut pas être démarré');
    }

    if (match.matchPlayers.filter(mp => mp.isStarter).length !== 11) {
      throw new BadRequestException('Vous devez définir une composition de 11 titulaires avant de démarrer le match');
    }

    return this.prisma.match.update({
      where: { id },
      data: {
        status: 'LIVE',
        startTime: new Date(),
      },
      include: {
        team: true,
        matchPlayers: {
          include: { player: true },
        },
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
    });
  }

  async endMatch(id: string, userId: string) {
    const match = await this.findOne(id, userId);

    if (match.status !== 'LIVE') {
      throw new BadRequestException('Le match n\'est pas en cours');
    }

    return this.prisma.match.update({
      where: { id },
      data: {
        status: 'FINISHED',
        endTime: new Date(),
      },
      include: {
        team: true,
        matchPlayers: {
          include: { player: true },
        },
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
    });
  }

  async addGoal(userId: string, goalDto: AddGoalDto) {
    const { matchId, playerId, minute, isOwnGoal = false } = goalDto;
    const match = await this.findOne(matchId, userId);

    if (match.status !== 'LIVE') {
      throw new BadRequestException('Le match n\'est pas en cours');
    }

    // Vérifier que le joueur participe au match
    const matchPlayer = match.matchPlayers.find(mp => mp.playerId === playerId);
    if (!matchPlayer) {
      throw new BadRequestException('Ce joueur ne participe pas au match');
    }

    const goal = await this.prisma.goal.create({
      data: {
        matchId,
        playerId,
        minute,
        isOwnGoal,
      },
      include: {
        player: true,
      },
    });

    // Mettre à jour le score si ce n'est pas un but contre son camp
    if (!isOwnGoal) {
      await this.prisma.match.update({
        where: { id: matchId },
        data: {
          ourScore: { increment: 1 },
        },
      });
    }

    return goal;
  }

  async addAssist(userId: string, assistDto: AddAssistDto) {
    const { matchId, playerId, minute } = assistDto;
    const match = await this.findOne(matchId, userId);

    if (match.status !== 'LIVE') {
      throw new BadRequestException('Le match n\'est pas en cours');
    }

    // Vérifier que le joueur participe au match
    const matchPlayer = match.matchPlayers.find(mp => mp.playerId === playerId);
    if (!matchPlayer) {
      throw new BadRequestException('Ce joueur ne participe pas au match');
    }

    return this.prisma.assist.create({
      data: {
        matchId,
        playerId,
        minute,
      },
      include: {
        player: true,
      },
    });
  }

  async addCard(userId: string, cardDto: AddCardDto) {
    const { matchId, playerId, type, minute, reason } = cardDto;
    const match = await this.findOne(matchId, userId);

    if (match.status !== 'LIVE') {
      throw new BadRequestException('Le match n\'est pas en cours');
    }

    // Vérifier que le joueur participe au match
    const matchPlayer = match.matchPlayers.find(mp => mp.playerId === playerId);
    if (!matchPlayer) {
      throw new BadRequestException('Ce joueur ne participe pas au match');
    }

    return this.prisma.card.create({
      data: {
        matchId,
        playerId,
        type,
        minute,
        reason,
      },
      include: {
        player: true,
      },
    });
  }

  async addSubstitution(userId: string, substitutionDto: AddSubstitutionDto) {
    const { matchId, playerInId, playerOutId, minute } = substitutionDto;
    const match = await this.findOne(matchId, userId);

    if (match.status !== 'LIVE') {
      throw new BadRequestException('Le match n\'est pas en cours');
    }

    // Vérifier que le joueur qui sort participe au match et est sur le terrain
    const playerOut = match.matchPlayers.find(mp => mp.playerId === playerOutId);
    if (!playerOut) {
      throw new BadRequestException('Le joueur qui sort ne participe pas au match');
    }

    // Vérifier que le joueur qui entre est remplaçant
    const playerIn = match.matchPlayers.find(mp => mp.playerId === playerInId);
    if (!playerIn || playerIn.isStarter) {
      throw new BadRequestException('Le joueur qui entre doit être un remplaçant');
    }

    // Créer les enregistrements de substitution
    const substitutionIn = await this.prisma.substitutionIn.create({
      data: {
        playerId: playerInId,
      },
    });

    const substitutionOut = await this.prisma.substitutionOut.create({
      data: {
        playerId: playerOutId,
      },
    });

    const substitution = await this.prisma.substitution.create({
      data: {
        matchId,
        playerInId: substitutionIn.id,
        playerOutId: substitutionOut.id,
        minute,
      },
      include: {
        playerIn: {
          include: { player: true },
        },
        playerOut: {
          include: { player: true },
        },
      },
    });

    // Mettre à jour les minutes jouées
    await this.prisma.matchPlayer.update({
      where: {
        matchId_playerId: {
          matchId,
          playerId: playerOutId,
        },
      },
      data: {
        minutesPlayed: minute,
      },
    });

    return substitution;
  }

  async getMatchStats(id: string, userId: string) {
    const match = await this.findOne(id, userId);

    const starters = match.matchPlayers.filter(mp => mp.isStarter);
    const substitutes = match.matchPlayers.filter(mp => !mp.isStarter);
    
    const totalGoals = match.goals.length;
    const totalAssists = match.assists.length;
    const totalCards = match.cards.length;
    const yellowCards = match.cards.filter(c => c.type === 'YELLOW').length;
    const redCards = match.cards.filter(c => c.type === 'RED').length;

    return {
      starters: starters.length,
      substitutes: substitutes.length,
      totalGoals,
      totalAssists,
      totalCards,
      yellowCards,
      redCards,
      substitutions: match.substitutions.length,
      possession: 0, // À implémenter si nécessaire
      shots: 0, // À implémenter si nécessaire
    };
  }
}