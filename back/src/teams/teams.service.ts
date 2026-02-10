import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException, 
  BadRequestException,
  ConflictException 
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { UpdateTeamMemberRoleDto } from './dto/update-team-member-role.dto';
import { PaginationQueryDto, PaginatedResult } from '../common/dto/pagination-query.dto';
import { club_role, team_role } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== HELPERS PRIVÉS ====================

  /**
   * Récupère le rôle d'un utilisateur dans une TEAM
   * @returns Le rôle (COACH/ASSISTANT_COACH) ou null
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
   * Récupère le rôle d'un utilisateur dans le CLUB parent
   * Utilisé pour vérifier si l'utilisateur peut accéder à la team
   * @returns Le rôle (PRESIDENT/RESPONSABLE/COACH) ou null
   */
  private async getUserRoleInClub(clubId: string, userId: string): Promise<club_role | null> {
    const clubUser = await this.prisma.clubUser.findFirst({
      where: {
        club_id: clubId,
        user_id: userId,
      },
    });
    return clubUser?.role || null;
  }

  /**
   * Vérifie si l'utilisateur est PRESIDENT du club
   * Le président a un OVERRIDE total sur toutes les teams
   */
  private async isClubPresident(clubId: string, userId: string): Promise<boolean> {
    const role = await this.getUserRoleInClub(clubId, userId);
    return role === club_role.PRESIDENT;
  }

  /**
   * Vérifie si l'utilisateur peut accéder aux teams du club
   * Requis: être membre du club (PRESIDENT, RESPONSABLE ou COACH)
   */
  private async canAccessTeam(clubId: string, userId: string): Promise<boolean> {
    const role = await this.getUserRoleInClub(clubId, userId);
    return role !== null; // Tous les membres du club peuvent accéder
  }

  /**
   * Vérifie si l'utilisateur peut modifier/supprimer la team
   * Autorisé pour: COACH de la team OU PRESIDENT du club
   */
  private canModifyTeam(teamRole: team_role | null, isPresident: boolean): boolean {
    return isPresident || teamRole === team_role.COACH;
  }

  /**
   * Vérifie si l'utilisateur peut gérer les membres (COACH et ASSISTANT_COACH)
   * Autorisé pour: COACH de la team OU PRESIDENT du club
   */
  private canManageAllMembers(teamRole: team_role | null, isPresident: boolean): boolean {
    return isPresident || teamRole === team_role.COACH;
  }

  // ==================== CRUD DE BASE ====================

  /**
   * Créer une team dans un club
   * Le créateur devient COACH par défaut, sauf si coach_user_id est fourni
   */
  async create(createTeamDto: CreateTeamDto, userId: string) {
    // Vérifier que le club existe
    const club = await this.prisma.club.findUnique({
      where: { id: createTeamDto.club_id },
    });
    if (!club) {
      throw new NotFoundException('Club non trouvé');
    }

    // Vérifier que l'utilisateur est membre du club
    const hasAccess = await this.canAccessTeam(createTeamDto.club_id, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Vous devez être membre du club pour créer une équipe');
    }

    // Déterminer qui sera le coach
    const coachUserId = createTeamDto.coach_user_id || userId;

    // Si un coach spécifique est fourni, vérifier qu'il existe
    if (createTeamDto.coach_user_id) {
      const coachUser = await this.prisma.user.findUnique({
        where: { id: createTeamDto.coach_user_id },
      });
      if (!coachUser) {
        throw new NotFoundException('Utilisateur coach non trouvé');
      }
    }

    // Transaction pour créer team + TeamUser atomiquement
    return this.prisma.$transaction(async (tx) => {
      // Créer la team
      const team = await tx.team.create({
        data: {
          name: createTeamDto.name,
          category: createTeamDto.category,
          club_id: createTeamDto.club_id,
        },
      });

      // Créer le TeamUser pour le coach
      await tx.teamUser.create({
        data: {
          team_id: team.id,
          user_id: coachUserId,
          role: team_role.COACH,
        },
      });

      return team;
    });
  }

  /**
   * Lister toutes les teams d'un club
   * Avec pagination, recherche par nom et tri
   * Accessible à tous les membres du club
   * Inclut le rôle de l'utilisateur dans chaque team (si membre)
   */
  async findAll(clubId: string, userId: string, paginationQuery: PaginationQueryDto = {}): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 20, sortBy, order = 'asc', search } = paginationQuery;

    // Vérifier que l'utilisateur est membre du club
    const hasAccess = await this.canAccessTeam(clubId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Vous devez être membre du club pour voir ses équipes');
    }

    // Construire le WHERE dynamique
    const where: any = { club_id: clubId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Construire le ORDER BY
    const allowedSortFields = ['name', 'category', 'created_at'];
    const orderBy = sortBy && allowedSortFields.includes(sortBy)
      ? { [sortBy]: order }
      : { name: 'asc' as const };

    // Compter le total
    const total = await this.prisma.team.count({ where });

    const teams = await this.prisma.team.findMany({
      where,
      include: {
        _count: {
          select: {
            players: true,
            teamUsers: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Pour chaque team, récupérer le rôle de l'utilisateur
    const teamsWithRole = await Promise.all(
      teams.map(async (team) => {
        const myRole = await this.getUserRoleInTeam(team.id, userId);
        return {
          ...team,
          myRole,
        };
      })
    );

    return {
      data: teamsWithRole,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupérer les détails d'une team
   * Inclut: membres, joueurs, mon rôle dans la team
   */
  async findOne(id: string, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        teamUsers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        players: true,
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    // Vérifier que l'utilisateur est membre du club
    const hasAccess = await this.canAccessTeam(team.club_id, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Vous devez être membre du club pour voir cette équipe');
    }

    const myTeamRole = await this.getUserRoleInTeam(id, userId);
    const myClubRole = await this.getUserRoleInClub(team.club_id, userId);

    return {
      ...team,
      myTeamRole,
      myClubRole,
    };
  }

  /**
   * Modifier une team (nom, catégorie)
   * Autorisé pour: COACH de la team OU PRESIDENT du club
   */
  async update(id: string, userId: string, updateTeamDto: UpdateTeamDto) {
    const team = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    const teamRole = await this.getUserRoleInTeam(id, userId);
    const isPresident = await this.isClubPresident(team.club_id, userId);

    if (!this.canModifyTeam(teamRole, isPresident)) {
      throw new ForbiddenException('Seul le coach de l\'équipe ou le président du club peut modifier l\'équipe');
    }

    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
    });
  }

  /**
   * Supprimer une team
   * Autorisé pour: COACH de la team OU PRESIDENT du club
   * Cascade: supprime players, teamUsers, matches
   */
  async remove(id: string, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    const teamRole = await this.getUserRoleInTeam(id, userId);
    const isPresident = await this.isClubPresident(team.club_id, userId);

    if (!this.canModifyTeam(teamRole, isPresident)) {
      throw new ForbiddenException('Seul le coach de l\'équipe ou le président du club peut supprimer l\'équipe');
    }

    return this.prisma.team.delete({
      where: { id },
    });
  }

  // ==================== GESTION DES MEMBRES ====================

  /**
   * Récupérer la liste des membres d'une team
   * Accessible à tous les membres du club
   */
  async getMembers(teamId: string, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    const hasAccess = await this.canAccessTeam(team.club_id, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Vous devez être membre du club pour voir les membres de cette équipe');
    }

    return this.prisma.teamUser.findMany({
      where: { team_id: teamId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  }

  /**
   * Ajouter un membre à la team (COACH ou ASSISTANT_COACH uniquement)
   * Permissions: COACH de la team ou PRESIDENT du club
   * Pour ajouter des joueurs de foot, utiliser le module Players
   */
  async addMember(teamId: string, userId: string, addMemberDto: AddTeamMemberDto) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    const teamRole = await this.getUserRoleInTeam(teamId, userId);
    const isPresident = await this.isClubPresident(team.club_id, userId);

    // Seul COACH ou PRESIDENT peut ajouter des membres
    if (!this.canManageAllMembers(teamRole, isPresident)) {
      throw new ForbiddenException('Seul le coach ou le président du club peut ajouter un membre');
    }

    // Vérifier que l'utilisateur à ajouter existe
    const userToAdd = await this.prisma.user.findUnique({
      where: { id: addMemberDto.user_id },
    });
    if (!userToAdd) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier que l'utilisateur n'est pas déjà membre
    const existingMember = await this.prisma.teamUser.findFirst({
      where: {
        team_id: teamId,
        user_id: addMemberDto.user_id,
      },
    });
    if (existingMember) {
      throw new ConflictException('Cet utilisateur est déjà membre de l\'équipe');
    }

    return this.prisma.teamUser.create({
      data: {
        team_id: teamId,
        user_id: addMemberDto.user_id,
        role: addMemberDto.role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  }

  /**
   * Retirer un membre de la team (COACH ou ASSISTANT_COACH)
   * Permissions: COACH de la team ou PRESIDENT du club
   * Règle: ASSISTANT_COACH ne peut pas retirer un COACH
   */
  async removeMember(teamId: string, userId: string, memberIdToRemove: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    const teamRole = await this.getUserRoleInTeam(teamId, userId);
    const isPresident = await this.isClubPresident(team.club_id, userId);

    // Seul COACH ou PRESIDENT peut retirer des membres
    if (!this.canManageAllMembers(teamRole, isPresident)) {
      throw new ForbiddenException('Seul le coach ou le président du club peut retirer un membre');
    }

    // Récupérer le membre à retirer
    const memberToRemove = await this.prisma.teamUser.findFirst({
      where: {
        team_id: teamId,
        user_id: memberIdToRemove,
      },
    });

    if (!memberToRemove) {
      throw new NotFoundException('Membre non trouvé dans cette équipe');
    }

    // ASSISTANT_COACH ne peut pas retirer un COACH
    if (teamRole === team_role.ASSISTANT_COACH && memberToRemove.role === team_role.COACH) {
      throw new ForbiddenException('Un assistant ne peut pas retirer un coach');
    }

    await this.prisma.teamUser.deleteMany({
      where: {
        team_id: teamId,
        user_id: memberIdToRemove,
      },
    });

    return { message: 'Membre retiré avec succès' };
  }

  /**
   * Modifier le rôle d'un membre (COACH ou ASSISTANT_COACH)
   * Permissions: COACH de la team ou PRESIDENT du club
   */
  async updateMemberRole(
    teamId: string,
    userId: string,
    memberIdToUpdate: string,
    updateRoleDto: UpdateTeamMemberRoleDto
  ) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    const teamRole = await this.getUserRoleInTeam(teamId, userId);
    const isPresident = await this.isClubPresident(team.club_id, userId);

    // Seul COACH ou PRESIDENT peut modifier les rôles
    if (!this.canManageAllMembers(teamRole, isPresident)) {
      throw new ForbiddenException('Seul le coach ou le président du club peut modifier les rôles');
    }

    // Vérifier que le membre existe
    const memberToUpdate = await this.prisma.teamUser.findFirst({
      where: {
        team_id: teamId,
        user_id: memberIdToUpdate,
      },
    });

    if (!memberToUpdate) {
      throw new NotFoundException('Membre non trouvé dans cette équipe');
    }

    await this.prisma.teamUser.updateMany({
      where: {
        team_id: teamId,
        user_id: memberIdToUpdate,
      },
      data: {
        role: updateRoleDto.role,
      },
    });

    // Récupérer le membre mis à jour
    return this.prisma.teamUser.findFirst({
      where: {
        team_id: teamId,
        user_id: memberIdToUpdate,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  }

  /**
   * Quitter une team
   * Contrairement au club, un COACH peut quitter une team
   */
  async leaveTeam(teamId: string, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }

    const teamRole = await this.getUserRoleInTeam(teamId, userId);

    if (!teamRole) {
      throw new NotFoundException('Vous n\'êtes pas membre de cette équipe');
    }

    await this.prisma.teamUser.deleteMany({
      where: {
        team_id: teamId,
        user_id: userId,
      },
    });

    return { message: 'Vous avez quitté l\'équipe avec succès' };
  }
}