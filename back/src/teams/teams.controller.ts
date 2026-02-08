import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query 
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { UpdateTeamMemberRoleDto } from './dto/update-team-member-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('teams')
@UseGuards(JwtAuthGuard) // Toutes les routes protégées par JWT
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // ==================== CRUD TEAM ====================

  /**
   * POST /teams
   * Créer une nouvelle équipe dans un club
   * Body: { name, category, club_id, coach_user_id? }
   * Le créateur devient COACH par défaut si coach_user_id absent
   */
  @Post()
  create(
    @Body() createTeamDto: CreateTeamDto,
    @CurrentUser() user: any
  ) {
    return this.teamsService.create(createTeamDto, user.id);
  }

  /**
   * GET /teams?clubId=xxx
   * Liste toutes les équipes d'un club
   * Query param obligatoire: clubId (UUID du club)
   * Accessible à tous les membres du club
   */
  @Get()
  findAll(
    @Query('clubId') clubId: string,
    @CurrentUser() user: any
  ) {
    return this.teamsService.findAll(clubId, user.id);
  }

  /**
   * GET /teams/:id
   * Récupérer les détails d'une équipe
   * Inclut: membres, joueurs, mon rôle team, mon rôle club
   * Accessible aux membres du club parent
   */
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.teamsService.findOne(id, user.id);
  }

  /**
   * PATCH /teams/:id
   * Modifier une équipe (nom, catégorie)
   * Body: { name?, category? }
   * Autorisé: COACH de l'équipe OU PRESIDENT du club
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateTeamDto: UpdateTeamDto
  ) {
    return this.teamsService.update(id, user.id, updateTeamDto);
  }

  /**
   * DELETE /teams/:id
   * Supprimer une équipe (cascade sur players, teamUsers, matches)
   * Autorisé: COACH de l'équipe OU PRESIDENT du club
   */
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.teamsService.remove(id, user.id);
  }

  // ==================== GESTION DES MEMBRES ====================

  /**
   * GET /teams/:id/members
   * Liste tous les membres d'une équipe (COACH, ASSISTANT_COACH)
   * Accessible à tous les membres du club
   */
  @Get(':id/members')
  getMembers(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.teamsService.getMembers(id, user.id);
  }

  /**
   * POST /teams/:id/members
   * Ajouter un membre à l'équipe (COACH ou ASSISTANT_COACH uniquement)
   * Body: { user_id, role: "COACH" | "ASSISTANT_COACH" }
   * Pour ajouter des joueurs de foot, utiliser POST /players
   * Permissions: COACH ou PRESIDENT club
   */
  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() addMemberDto: AddTeamMemberDto
  ) {
    return this.teamsService.addMember(id, user.id, addMemberDto);
  }

  /**
   * DELETE /teams/:id/members/:userId
   * Retirer un membre de l'équipe (COACH ou ASSISTANT_COACH)
   * Permissions: COACH ou PRESIDENT club
   * Règle: ASSISTANT_COACH ne peut pas retirer un COACH
   */
  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') teamId: string,
    @Param('userId') memberIdToRemove: string,
    @CurrentUser() user: any
  ) {
    return this.teamsService.removeMember(teamId, user.id, memberIdToRemove);
  }

  /**
   * PATCH /teams/:id/members/:userId
   * Changer le rôle d'un membre (COACH ou ASSISTANT_COACH)
   * Body: { role: "COACH" | "ASSISTANT_COACH" }
   * Permissions: COACH ou PRESIDENT club
   */
  @Patch(':id/members/:userId')
  updateMemberRole(
    @Param('id') teamId: string,
    @Param('userId') memberIdToUpdate: string,
    @CurrentUser() user: any,
    @Body() updateRoleDto: UpdateTeamMemberRoleDto
  ) {
    return this.teamsService.updateMemberRole(
      teamId,
      user.id,
      memberIdToUpdate,
      updateRoleDto
    );
  }

  /**
   * DELETE /teams/:id/leave
   * Quitter une équipe
   * Contrairement au club, même un COACH peut quitter
   */
  @Delete(':id/leave')
  leaveTeam(
    @Param('id') teamId: string,
    @CurrentUser() user: any
  ) {
    return this.teamsService.leaveTeam(teamId, user.id);
  }
}