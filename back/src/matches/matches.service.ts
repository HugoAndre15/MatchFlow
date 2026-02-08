import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { UpdateMatchStatusDto } from './dto/update-match-status.dto';
import { AddPlayersToMatchDto } from './dto/add-players-to-match.dto';
import { UpdateMatchPlayerDto } from './dto/update-match-player.dto';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { UpdateMatchEventDto } from './dto/update-match-event.dto';
import { club_role, team_role, match_status, match_event_type } from '@prisma/client';

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== HELPERS PRIVÉS ====================

  private async getUserRoleInTeam(teamId: string, userId: string): Promise<team_role | null> {
    const teamUser = await this.prisma.teamUser.findFirst({
      where: {
        team_id: teamId,
        user_id: userId,
      },
    });
    return teamUser?.role || null;
  }

  private async getTeamClubId(teamId: string): Promise<string | null> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { club_id: true },
    });
    return team?.club_id || null;
  }

  private async isClubPresident(clubId: string, userId: string): Promise<boolean> {
    const clubUser = await this.prisma.clubUser.findFirst({
      where: {
        club_id: clubId,
        user_id: userId,
      },
    });
    return clubUser?.role === club_role.PRESIDENT;
  }

  /**
   * Autorisé: COACH, ASSISTANT_COACH de la team OU PRESIDENT du club
   */
  private async canManageMatches(teamId: string, userId: string): Promise<boolean> {
    const clubId = await this.getTeamClubId(teamId);
    if (!clubId) return false;

    const isPresident = await this.isClubPresident(clubId, userId);
    if (isPresident) return true;

    const teamRole = await this.getUserRoleInTeam(teamId, userId);
    return teamRole === team_role.COACH || teamRole === team_role.ASSISTANT_COACH;
  }

  /**
   * Autorisé: COACH de la team OU PRESIDENT du club
   */
  private async canDeleteMatch(teamId: string, userId: string): Promise<boolean> {
    const clubId = await this.getTeamClubId(teamId);
    if (!clubId) return false;

    const isPresident = await this.isClubPresident(clubId, userId);
    if (isPresident) return true;

    const teamRole = await this.getUserRoleInTeam(teamId, userId);
    return teamRole === team_role.COACH;
  }

  private async canChangeStatus(teamId: string, userId: string): Promise<boolean> {
    return this.canDeleteMatch(teamId, userId);
  }

  /**
   * Autorisé: Tous les membres du club
   */
  private async canAccessTeamMatches(clubId: string, userId: string): Promise<boolean> {
    const clubUser = await this.prisma.clubUser.findFirst({
      where: {
        club_id: clubId,
        user_id: userId,
      },
    });
    return clubUser !== null;
  }

  /**
   * UPCOMING → LIVE → FINISHED (pas de retour arrière)
   */
  private validateStatusTransition(currentStatus: match_status, newStatus: match_status): void {
    if (currentStatus === newStatus) return;

    const validTransitions: Record<match_status, match_status[]> = {
      UPCOMING: [match_status.LIVE],
      LIVE: [match_status.FINISHED],
      FINISHED: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Transition de status invalide: ${currentStatus} → ${newStatus}. ` +
        `Transitions autorisées: ${validTransitions[currentStatus].join(', ') || 'aucune'}`,
      );
    }
  }

  private calculateScore(matchEvents: any[]): { goals: number } {
    const goals = matchEvents.filter(e => e.event_type === 'GOAL');
    return { goals: goals.length };
  }

  // ==================== CRUD MATCHS ====================

  async create(createMatchDto: CreateMatchDto, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: createMatchDto.team_id },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    const canManage = await this.canManageMatches(createMatchDto.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException('Seuls le coach, l\'assistant ou le président du club peuvent créer un match');
    }

    return this.prisma.match.create({
      data: {
        team_id: createMatchDto.team_id,
        opponent: createMatchDto.opponent,
        location: createMatchDto.location,
        match_date: new Date(createMatchDto.match_date),
        status: match_status.UPCOMING,
      },
    });
  }

  async findAll(teamId: string, userId: string) {
    if (!teamId) {
      throw new BadRequestException('Le paramètre teamId est requis');
    }

    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    const canAccess = await this.canAccessTeamMatches(team.club_id, userId);
    if (!canAccess) {
      throw new ForbiddenException('Vous devez être membre du club pour voir les matchs');
    }

    return this.prisma.match.findMany({
      where: { team_id: teamId },
      include: {
        _count: {
          select: {
            matchEvents: true,
            matchPlayers: true,
          },
        },
      },
      orderBy: {
        match_date: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            club: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        matchPlayers: {
          include: {
            player: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                jersey_number: true,
                position: true,
              },
            },
          },
          orderBy: [
            { status: 'asc' },
            { player: { last_name: 'asc' } },
          ],
        },
        matchEvents: {
          include: {
            player: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                jersey_number: true,
                position: true,
              },
            },
          },
          orderBy: {
            minute: 'asc',
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    const canAccess = await this.canAccessTeamMatches(match.team.club_id, userId);
    if (!canAccess) {
      throw new ForbiddenException('Vous devez être membre du club pour voir ce match');
    }

    const score = this.calculateScore(match.matchEvents);

    return {
      ...match,
      score,
    };
  }

  async update(id: string, userId: string, updateMatchDto: UpdateMatchDto) {
    const match = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    const canManage = await this.canManageMatches(match.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException('Seuls le coach, l\'assistant ou le président du club peuvent modifier un match');
    }

    const { opponent, location, match_date } = updateMatchDto;

    return this.prisma.match.update({
      where: { id },
      data: {
        opponent,
        location,
        match_date: match_date ? new Date(match_date) : undefined,
      },
    });
  }

  async updateStatus(id: string, userId: string, updateStatusDto: UpdateMatchStatusDto) {
    const match = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    const canChange = await this.canChangeStatus(match.team_id, userId);
    if (!canChange) {
      throw new ForbiddenException('Seul le coach ou le président du club peut changer le status du match');
    }

    this.validateStatusTransition(match.status, updateStatusDto.status);

    return this.prisma.match.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
      },
    });
  }

  async remove(id: string, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    const canDelete = await this.canDeleteMatch(match.team_id, userId);
    if (!canDelete) {
      throw new ForbiddenException('Seul le coach ou le président du club peut supprimer un match');
    }

    return this.prisma.match.delete({
      where: { id },
    });
  }

  // ==================== GESTION DES JOUEURS CONVOQUÉS ====================

  async addPlayersToMatch(matchId: string, addPlayersDto: AddPlayersToMatchDto, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { team: true },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    const canManage = await this.canManageMatches(match.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException('Seuls le coach, l\'assistant ou le président du club peuvent convoquer des joueurs');
    }

    if (match.status === match_status.FINISHED) {
      throw new BadRequestException('Impossible de modifier la convocation d\'un match terminé');
    }

    // Vérifier que tous les joueurs existent
    const playerIds = addPlayersDto.players.map(p => p.player_id);
    const players = await this.prisma.player.findMany({
      where: { id: { in: playerIds } },
    });

    if (players.length !== playerIds.length) {
      throw new BadRequestException('Un ou plusieurs joueurs n\'existent pas');
    }

    // Vérifier que tous les joueurs appartiennent à la team du match
    const invalidPlayers = players.filter(p => p.team_id !== match.team_id);
    if (invalidPlayers.length > 0) {
      throw new BadRequestException(
        `Les joueurs suivants n'appartiennent pas à l'équipe du match: ${invalidPlayers.map(p => p.last_name).join(', ')}`,
      );
    }

    // Vérifier que tous les joueurs ont le statut ACTIVE
    const inactivePlayers = players.filter(p => p.status !== 'ACTIVE');
    if (inactivePlayers.length > 0) {
      const details = inactivePlayers.map(p => `${p.last_name} (${p.status})`).join(', ');
      throw new BadRequestException(
        `Impossible de convoquer des joueurs non actifs: ${details}`,
      );
    }

    // Créer les convocations (upsert pour gérer les doublons)
    const results: any[] = [];
    for (const playerToAdd of addPlayersDto.players) {
      try {
        const mp = await this.prisma.matchPlayer.upsert({
          where: {
            match_id_player_id: {
              match_id: matchId,
              player_id: playerToAdd.player_id,
            },
          },
          update: {
            status: playerToAdd.status,
          },
          create: {
            match_id: matchId,
            player_id: playerToAdd.player_id,
            status: playerToAdd.status,
          },
          include: {
            player: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                jersey_number: true,
                position: true,
              },
            },
          },
        });
        results.push(mp);
      } catch (error) {
        throw new ConflictException(`Erreur lors de la convocation du joueur ${playerToAdd.player_id}`);
      }
    }

    return results;
  }

  async getMatchPlayers(matchId: string, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { team: true },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    const canAccess = await this.canAccessTeamMatches(match.team.club_id, userId);
    if (!canAccess) {
      throw new ForbiddenException('Vous devez être membre du club pour voir les joueurs convoqués');
    }

    return this.prisma.matchPlayer.findMany({
      where: { match_id: matchId },
      include: {
        player: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            jersey_number: true,
            position: true,
            strong_foot: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { player: { last_name: 'asc' } },
      ],
    });
  }

  async updateMatchPlayerStatus(matchId: string, playerId: string, updateDto: UpdateMatchPlayerDto, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    const canManage = await this.canManageMatches(match.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException('Seuls le coach, l\'assistant ou le président du club peuvent modifier le statut d\'un joueur');
    }

    if (match.status === match_status.FINISHED) {
      throw new BadRequestException('Impossible de modifier le statut d\'un joueur pour un match terminé');
    }

    const matchPlayer = await this.prisma.matchPlayer.findUnique({
      where: {
        match_id_player_id: {
          match_id: matchId,
          player_id: playerId,
        },
      },
    });

    if (!matchPlayer) {
      throw new NotFoundException('Le joueur n\'est pas convoqué pour ce match');
    }

    return this.prisma.matchPlayer.update({
      where: {
        match_id_player_id: {
          match_id: matchId,
          player_id: playerId,
        },
      },
      data: {
        status: updateDto.status,
      },
      include: {
        player: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            jersey_number: true,
            position: true,
          },
        },
      },
    });
  }

  async removePlayerFromMatch(matchId: string, playerId: string, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    const canManage = await this.canManageMatches(match.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException('Seuls le coach, l\'assistant ou le président du club peuvent retirer un joueur');
    }

    if (match.status === match_status.FINISHED) {
      throw new BadRequestException('Impossible de retirer un joueur d\'un match terminé');
    }

    const matchPlayer = await this.prisma.matchPlayer.findUnique({
      where: {
        match_id_player_id: {
          match_id: matchId,
          player_id: playerId,
        },
      },
    });

    if (!matchPlayer) {
      throw new NotFoundException('Le joueur n\'est pas convoqué pour ce match');
    }

    // Vérifier que le joueur n'a pas d'événements dans ce match
    const eventsCount = await this.prisma.matchEvent.count({
      where: {
        match_id: matchId,
        player_id: playerId,
      },
    });

    if (eventsCount > 0) {
      throw new BadRequestException(
        `Impossible de retirer ce joueur : ${eventsCount} événement(s) enregistré(s). Supprimez d'abord les événements.`,
      );
    }

    await this.prisma.matchPlayer.delete({
      where: {
        match_id_player_id: {
          match_id: matchId,
          player_id: playerId,
        },
      },
    });

    return { message: 'Joueur retiré de la convocation' };
  }

    // ==================== GESTION DES ÉVÉNEMENTS DE MATCH ====================

  /**
   * Ajouter un événement à un match
   * Validations: joueur convoqué, minute 0-120, ASSIST doit référencer un GOAL,
   * 2ème YELLOW_CARD → création automatique d'un RED_CARD
   */
  async addEventToMatch(matchId: string, createEventDto: CreateMatchEventDto, userId: string) {
    // 1. Vérifier que le match existe
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    // 2. Vérifier les permissions (COACH, ASSISTANT_COACH ou PRESIDENT)
    const canManage = await this.canManageMatches(match.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException(
        'Seuls le coach, l\'assistant ou le président du club peuvent ajouter un événement',
      );
    }

    // 3. Vérifier que le joueur est convoqué pour ce match
    const matchPlayer = await this.prisma.matchPlayer.findUnique({
      where: {
        match_id_player_id: {
          match_id: matchId,
          player_id: createEventDto.player_id,
        },
      },
    });

    if (!matchPlayer) {
      throw new BadRequestException(
        'Le joueur doit être convoqué pour ce match avant d\'ajouter un événement',
      );
    }

    // 4. Si c'est un ASSIST, vérifier que related_event_id pointe vers un GOAL du même match
    if (createEventDto.event_type === match_event_type.ASSIST) {
      if (!createEventDto.related_event_id) {
        throw new BadRequestException(
          'Un ASSIST doit être lié à un GOAL via related_event_id',
        );
      }

      const relatedGoal = await this.prisma.matchEvent.findUnique({
        where: { id: createEventDto.related_event_id },
      });

      if (!relatedGoal || relatedGoal.match_id !== matchId || relatedGoal.event_type !== match_event_type.GOAL) {
        throw new BadRequestException(
          'Le related_event_id doit référencer un GOAL existant dans le même match',
        );
      }
    }

    // 5. Créer l'événement
    const event = await this.prisma.matchEvent.create({
      data: {
        match_id: matchId,
        player_id: createEventDto.player_id,
        event_type: createEventDto.event_type,
        minute: createEventDto.minute,
        zone: createEventDto.zone,
        body_part: createEventDto.body_part,
        related_event_id: createEventDto.related_event_id,
      },
      include: {
        player: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            jersey_number: true,
            position: true,
          },
        },
      },
    });

    // 6. Si c'est un YELLOW_CARD, vérifier si c'est le 2ème → RED_CARD automatique
    if (createEventDto.event_type === match_event_type.YELLOW_CARD) {
      const yellowCount = await this.prisma.matchEvent.count({
        where: {
          match_id: matchId,
          player_id: createEventDto.player_id,
          event_type: match_event_type.YELLOW_CARD,
        },
      });

      if (yellowCount >= 2) {
        // Créer automatiquement un RED_CARD
        const redCard = await this.prisma.matchEvent.create({
          data: {
            match_id: matchId,
            player_id: createEventDto.player_id,
            event_type: match_event_type.RED_CARD,
            minute: createEventDto.minute,
          },
          include: {
            player: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                jersey_number: true,
                position: true,
              },
            },
          },
        });

        return {
          event,
          autoRedCard: redCard,
          message: '2ème carton jaune ! Carton rouge automatique créé.',
        };
      }
    }

    return event;
  }

  /**
   * Récupérer tous les événements d'un match, triés par minute
   */
  async getMatchEvents(matchId: string, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { team: true },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    const canAccess = await this.canAccessTeamMatches(match.team.club_id, userId);
    if (!canAccess) {
      throw new ForbiddenException('Vous devez être membre du club pour voir les événements');
    }

    return this.prisma.matchEvent.findMany({
      where: { match_id: matchId },
      include: {
        player: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            jersey_number: true,
            position: true,
          },
        },
        relatedEvent: {
          select: {
            id: true,
            event_type: true,
            player: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
      orderBy: { minute: 'asc' },
    });
  }

  /**
   * Modifier un événement de match
   */
  async updateMatchEvent(matchId: string, eventId: string, updateDto: UpdateMatchEventDto, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    const canManage = await this.canManageMatches(match.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException(
        'Seuls le coach, l\'assistant ou le président du club peuvent modifier un événement',
      );
    }

    const event = await this.prisma.matchEvent.findUnique({
      where: { id: eventId },
    });

    if (!event || event.match_id !== matchId) {
      throw new NotFoundException('Événement non trouvé dans ce match');
    }

    // Si on change le player_id, vérifier que le nouveau joueur est convoqué
    if (updateDto.player_id) {
      const matchPlayer = await this.prisma.matchPlayer.findUnique({
        where: {
          match_id_player_id: {
            match_id: matchId,
            player_id: updateDto.player_id,
          },
        },
      });

      if (!matchPlayer) {
        throw new BadRequestException(
          'Le joueur doit être convoqué pour ce match',
        );
      }
    }

    // Si on change le type en ASSIST, vérifier le related_event_id
    const finalType = updateDto.event_type || event.event_type;
    if (finalType === match_event_type.ASSIST) {
      const relatedId = updateDto.related_event_id ?? event.related_event_id;
      if (!relatedId) {
        throw new BadRequestException(
          'Un ASSIST doit être lié à un GOAL via related_event_id',
        );
      }

      const relatedGoal = await this.prisma.matchEvent.findUnique({
        where: { id: relatedId },
      });

      if (!relatedGoal || relatedGoal.match_id !== matchId || relatedGoal.event_type !== match_event_type.GOAL) {
        throw new BadRequestException(
          'Le related_event_id doit référencer un GOAL existant dans le même match',
        );
      }
    }

    return this.prisma.matchEvent.update({
      where: { id: eventId },
      data: {
        player_id: updateDto.player_id,
        event_type: updateDto.event_type,
        minute: updateDto.minute,
        zone: updateDto.zone,
        body_part: updateDto.body_part,
        related_event_id: updateDto.related_event_id,
      },
      include: {
        player: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            jersey_number: true,
            position: true,
          },
        },
      },
    });
  }

  /**
   * Supprimer un événement de match
   * Si c'est un GOAL, supprime aussi les ASSIST liés
   */
  async removeMatchEvent(matchId: string, eventId: string, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    const canManage = await this.canManageMatches(match.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException(
        'Seuls le coach, l\'assistant ou le président du club peuvent supprimer un événement',
      );
    }

    const event = await this.prisma.matchEvent.findUnique({
      where: { id: eventId },
    });

    if (!event || event.match_id !== matchId) {
      throw new NotFoundException('Événement non trouvé dans ce match');
    }

    // Si c'est un GOAL, supprimer d'abord les ASSIST liés à ce goal
    if (event.event_type === match_event_type.GOAL) {
      await this.prisma.matchEvent.deleteMany({
        where: {
          related_event_id: eventId,
        },
      });
    }

    await this.prisma.matchEvent.delete({
      where: { id: eventId },
    });

    return { message: 'Événement supprimé' };
  }
}
