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
}