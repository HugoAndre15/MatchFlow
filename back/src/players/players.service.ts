import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException 
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { club_role, team_role } from '@prisma/client';

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== HELPERS PRIVÉS ====================

  /**
   * Récupère le rôle d'un utilisateur dans une TEAM
   */
  private async getUserRoleInTeam(teamId: string, userId: string): Promise<team_role | null> {
    const teamUser = await this.prisma.teamUser.findFirst({
      where: {
        team_id: teamId,
        user_id: userId,
      },
    });
    return teamUser?.role || null;
  }

  /**
   * Récupère le club_id d'une team
   */
  private async getTeamClubId(teamId: string): Promise<string | null> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { club_id: true },
    });
    return team?.club_id || null;
  }

  /**
   * Vérifie si l'utilisateur est PRESIDENT du club
   */
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
   * Vérifie si l'utilisateur peut gérer les players de cette team
   * Autorisé: COACH, ASSISTANT_COACH de la team OU PRESIDENT du club
   */
  private async canManagePlayers(teamId: string, userId: string): Promise<boolean> {
    const clubId = await this.getTeamClubId(teamId);
    if (!clubId) {
      return false;
    }

    // Vérifier si PRESIDENT du club
    const isPresident = await this.isClubPresident(clubId, userId);
    if (isPresident) {
      return true;
    }

    // Vérifier si COACH ou ASSISTANT_COACH de la team
    const teamRole = await this.getUserRoleInTeam(teamId, userId);
    return teamRole === team_role.COACH || teamRole === team_role.ASSISTANT_COACH;
  }

  // ==================== CRUD ====================

  /**
   * Créer un joueur dans une équipe
   */
  async create(createPlayerDto: CreatePlayerDto, userId: string) {
    // Vérifier que la team existe
    const team = await this.prisma.team.findUnique({
      where: { id: createPlayerDto.team_id },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    // Vérifier les permissions
    const canManage = await this.canManagePlayers(createPlayerDto.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException('Seuls le coach, l\'assistant ou le président du club peuvent ajouter un joueur');
    }

    return this.prisma.player.create({
      data: createPlayerDto,
    });
  }

  /**
   * Lister tous les joueurs d'une équipe
   */
  async findAll(teamId: string, userId: string) {
    // Vérifier que la team existe
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    // Vérifier les permissions
    const canManage = await this.canManagePlayers(teamId, userId);
    if (!canManage) {
      throw new ForbiddenException('Vous n\'avez pas accès aux joueurs de cette équipe');
    }

    return this.prisma.player.findMany({
      where: { team_id: teamId },
      orderBy: [
        { jersey_number: 'asc' },
        { last_name: 'asc' },
      ],
    });
  }

  /**
   * Récupérer un joueur par ID
   */
  async findOne(id: string, userId: string) {
    const player = await this.prisma.player.findUnique({
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
      },
    });

    if (!player) {
      throw new NotFoundException('Joueur non trouvé');
    }

    // Vérifier les permissions
    const canManage = await this.canManagePlayers(player.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce joueur');
    }

    return player;
  }

  /**
   * Modifier un joueur (peut changer d'équipe via team_id)
   */
  async update(id: string, userId: string, updatePlayerDto: UpdatePlayerDto) {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException('Joueur non trouvé');
    }

    // Vérifier les permissions sur l'équipe actuelle
    const canManageCurrent = await this.canManagePlayers(player.team_id, userId);
    if (!canManageCurrent) {
      throw new ForbiddenException('Seuls le coach, l\'assistant ou le président du club peuvent modifier un joueur');
    }

    // Si on change d'équipe, vérifier les permissions sur la nouvelle équipe
    if (updatePlayerDto.team_id && updatePlayerDto.team_id !== player.team_id) {
      const newTeam = await this.prisma.team.findUnique({
        where: { id: updatePlayerDto.team_id },
      });

      if (!newTeam) {
        throw new NotFoundException('Nouvelle équipe non trouvée');
      }

      const canManageNew = await this.canManagePlayers(updatePlayerDto.team_id, userId);
      if (!canManageNew) {
        throw new ForbiddenException('Vous n\'avez pas les permissions sur la nouvelle équipe');
      }
    }

    return this.prisma.player.update({
      where: { id },
      data: updatePlayerDto,
    });
  }

  /**
   * Supprimer un joueur
   */
  async remove(id: string, userId: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException('Joueur non trouvé');
    }

    // Vérifier les permissions
    const canManage = await this.canManagePlayers(player.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException('Seuls le coach, l\'assistant ou le président du club peuvent supprimer un joueur');
    }

    return this.prisma.player.delete({
      where: { id },
    });
  }
  
    // ==================== STATISTIQUES ====================

  /**
   * Récupérer les statistiques agrégées d'un joueur
   */
  async getPlayerStats(playerId: string, userId: string) {
    // 1. Vérifier que le joueur existe
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException('Joueur non trouvé');
    }

    // 2. Vérifier les permissions
    const canManage = await this.canManagePlayers(player.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException('Vous n\'avez pas accès aux stats de ce joueur');
    }

    // 3. Récupérer les convocations (MatchPlayer)
    const matchPlayers = await this.prisma.matchPlayer.findMany({
      where: { player_id: playerId },
    });

    const totalMatches = matchPlayers.length;
    const matchesAsStarter = matchPlayers.filter(mp => mp.status === 'STARTER').length;
    const matchesAsSubstitute = matchPlayers.filter(mp => mp.status === 'SUBSTITUTE').length;

    // 4. Récupérer tous les événements du joueur
    const events = await this.prisma.matchEvent.findMany({
      where: { player_id: playerId },
    });

    // 5. Compter par type d'événement
    const goals = events.filter(e => e.event_type === 'GOAL').length;
    const assists = events.filter(e => e.event_type === 'ASSIST').length;
    const yellowCards = events.filter(e => e.event_type === 'YELLOW_CARD').length;
    const redCards = events.filter(e => e.event_type === 'RED_CARD').length;
    const recoveries = events.filter(e => e.event_type === 'RECOVERY').length;
    const ballLosses = events.filter(e => e.event_type === 'BALL_LOSS').length;

    // 6. Buts par zone
    const goalEvents = events.filter(e => e.event_type === 'GOAL');
    const goalsByZone = {
      LEFT: goalEvents.filter(e => e.zone === 'LEFT').length,
      RIGHT: goalEvents.filter(e => e.zone === 'RIGHT').length,
      AXIS: goalEvents.filter(e => e.zone === 'AXIS').length,
      BOX: goalEvents.filter(e => e.zone === 'BOX').length,
      OUTSIDE: goalEvents.filter(e => e.zone === 'OUTSIDE').length,
    };

    // 7. Buts par partie du corps
    const goalsByBodyPart = {
      LEFT_FOOT: goalEvents.filter(e => e.body_part === 'LEFT_FOOT').length,
      RIGHT_FOOT: goalEvents.filter(e => e.body_part === 'RIGHT_FOOT').length,
      HEAD: goalEvents.filter(e => e.body_part === 'HEAD').length,
    };

    return {
      player_id: player.id,
      player_name: `${player.last_name} ${player.first_name}`,
      total_matches: totalMatches,
      matches_as_starter: matchesAsStarter,
      matches_as_substitute: matchesAsSubstitute,
      goals,
      assists,
      yellow_cards: yellowCards,
      red_cards: redCards,
      recoveries,
      ball_losses: ballLosses,
      goals_by_zone: goalsByZone,
      goals_by_body_part: goalsByBodyPart,
    };
  }
}