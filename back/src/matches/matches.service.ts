import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { UpdateMatchStatusDto } from './dto/update-match-status.dto';
import { club_role, team_role, match_status } from '@prisma/client';

@Injectable()
export class MatchesService {
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
   * Vérifie si l'utilisateur peut gérer les matchs
   * Autorisé: COACH, ASSISTANT_COACH de la team OU PRESIDENT du club
   */
  private async canManageMatches(teamId: string, userId: string): Promise<boolean> {
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

  /**
   * Vérifie si l'utilisateur peut supprimer un match
   * Autorisé: COACH de la team OU PRESIDENT du club
   */
  private async canDeleteMatch(teamId: string, userId: string): Promise<boolean> {
    const clubId = await this.getTeamClubId(teamId);
    if (!clubId) {
      return false;
    }

    const isPresident = await this.isClubPresident(clubId, userId);
    if (isPresident) {
      return true;
    }

    const teamRole = await this.getUserRoleInTeam(teamId, userId);
    return teamRole === team_role.COACH;
  }

  /**
   * Vérifie si l'utilisateur peut changer le status du match
   * Autorisé: COACH de la team OU PRESIDENT du club
   */
  private async canChangeStatus(teamId: string, userId: string): Promise<boolean> {
    return this.canDeleteMatch(teamId, userId); // Même logique
  }

  /**
   * Vérifie si l'utilisateur peut voir les matchs de la team
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
   * Valide une transition de status
   * Règle: UPCOMING → LIVE → FINISHED (pas de retour arrière)
   */
  private validateStatusTransition(currentStatus: match_status, newStatus: match_status): void {
    // Si même status, pas besoin de valider
    if (currentStatus === newStatus) {
      return;
    }

    // Transitions valides
    const validTransitions: Record<match_status, match_status[]> = {
      UPCOMING: [match_status.LIVE],
      LIVE: [match_status.FINISHED],
      FINISHED: [], // Pas de transition depuis FINISHED
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Transition de status invalide: ${currentStatus} → ${newStatus}. ` +
        `Transitions autorisées: ${validTransitions[currentStatus].join(', ') || 'aucune'}`
      );
    }
  }

  /**
   * Calcule le score du match depuis les événements GOAL
   */
  private calculateScore(matchEvents: any[]): { goals: number } {
    const goals = matchEvents.filter(e => e.event_type === 'GOAL');
    return {
      goals: goals.length,
    };
  }

  // ==================== CRUD ====================

  /**
   * Créer un match
   * Le status sera UPCOMING par défaut
   */
  async create(createMatchDto: CreateMatchDto, userId: string) {
    // Vérifier que la team existe
    const team = await this.prisma.team.findUnique({
      where: { id: createMatchDto.team_id },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    // Vérifier les permissions
    const canManage = await this.canManageMatches(createMatchDto.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException('Seuls le coach, l\'assistant ou le président du club peuvent créer un match');
    }

    return this.prisma.match.create({
      data: {
        ...createMatchDto,
        match_date: new Date(createMatchDto.match_date),
        status: match_status.UPCOMING, // Status par défaut
      },
    });
  }

  /**
   * Lister tous les matchs d'une équipe
   * Triés par date décroissante (plus récents en premier)
   */
  async findAll(teamId: string, userId: string) {
    // Vérifier que la team existe
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    // Vérifier les permissions (tous les membres du club)
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
          },
        },
      },
      orderBy: {
        match_date: 'desc', // Plus récents en premier
      },
    });
  }

  /**
   * Récupérer les détails d'un match
   * Inclut: team, club, événements avec joueurs, score calculé
   */
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
            minute: 'asc', // Événements triés par minute
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    // Vérifier les permissions
    const canAccess = await this.canAccessTeamMatches(match.team.club_id, userId);
    if (!canAccess) {
      throw new ForbiddenException('Vous devez être membre du club pour voir ce match');
    }

    // Calculer le score
    const score = this.calculateScore(match.matchEvents);

    return {
      ...match,
      score, // Ajouter le score calculé
    };
  }

  /**
   * Modifier un match (opponent, location, date)
   * Le status ne se modifie PAS ici (route séparée)
   */
  async update(id: string, userId: string, updateMatchDto: UpdateMatchDto) {
    const match = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    // Vérifier les permissions
    const canManage = await this.canManageMatches(match.team_id, userId);
    if (!canManage) {
      throw new ForbiddenException('Seuls le coach, l\'assistant ou le président du club peuvent modifier un match');
    }

    // Extraire uniquement les champs autorisés (pas le status)
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

  /**
   * Changer le status d'un match
   * Route séparée avec validation stricte des transitions
   * Autorisé: COACH ou PRESIDENT uniquement
   */
  async updateStatus(id: string, userId: string, updateStatusDto: UpdateMatchStatusDto) {
    const match = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    // Vérifier les permissions (COACH ou PRESIDENT uniquement)
    const canChange = await this.canChangeStatus(match.team_id, userId);
    if (!canChange) {
      throw new ForbiddenException('Seul le coach ou le président du club peut changer le status du match');
    }

    // Valider la transition de status
    this.validateStatusTransition(match.status, updateStatusDto.status);

    return this.prisma.match.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
      },
    });
  }

  /**
   * Supprimer un match
   * Autorisé: COACH ou PRESIDENT uniquement
   * Cascade: supprime tous les matchEvents
   */
  async remove(id: string, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    // Vérifier les permissions (COACH ou PRESIDENT uniquement)
    const canDelete = await this.canDeleteMatch(match.team_id, userId);
    if (!canDelete) {
      throw new ForbiddenException('Seul le coach ou le président du club peut supprimer un match');
    }

    return this.prisma.match.delete({
      where: { id },
    });
  }
}