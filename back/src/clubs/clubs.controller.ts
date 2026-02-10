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
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { AddClubMemberDto } from './dto/add-club-member.dto';
import { UpdateClubMemberRoleDto } from './dto/update-club-member-role.dto';
import { TransferPresidencyDto } from './dto/transfer-presidency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('clubs')
@UseGuards(JwtAuthGuard) // 🔒 Toutes les routes sont protégées par JWT
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  // ==================== CRUD CLUB ====================

  /**
   * POST /clubs
   * Créer un nouveau club
   * L'utilisateur connecté devient automatiquement PRESIDENT
   */
  @Post()
  create(
    @Body() createClubDto: CreateClubDto,
    @CurrentUser() user: any
  ) {
    return this.clubsService.create(createClubDto, user.id);
  }

  /**
   * GET /clubs?page=1&limit=20&search=paris&sortBy=name&order=asc
   * Liste TOUS les clubs dont je suis membre
   * Avec pagination, recherche et tri
   * Retourne aussi mon rôle dans chaque club
   */
  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.clubsService.findAll(user.id, paginationQuery);
  }

  /**
   * GET /clubs/:id
   * Récupérer les détails d'un club spécifique
   * Inclut les membres, teams, et mon rôle dans le club
   * Accessible seulement si je suis membre
   */
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.clubsService.findOne(id, user.id);
  }

  /**
   * PATCH /clubs/:id
   * Modifier les infos d'un club (nom uniquement pour l'instant)
   * Réservé au PRESIDENT uniquement
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateClubDto: UpdateClubDto
  ) {
    return this.clubsService.update(id, user.id, updateClubDto);
  }

  /**
   * DELETE /clubs/:id
   * Supprimer un club (cascade sur teams et membres)
   * Réservé au PRESIDENT uniquement
   */
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.clubsService.remove(id, user.id);
  }

  // ==================== GESTION DES MEMBRES ====================

  /**
   * GET /clubs/:id/members
   * Liste tous les membres d'un club avec leurs rôles
   * Accessible à tous les membres du club
   */
  @Get(':id/members')
  getMembers(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.clubsService.getMembers(id, user.id);
  }

  /**
   * POST /clubs/:id/members
   * Ajouter un nouveau membre au club
   * Body: { userId: "uuid", role: "PRESIDENT" | "RESPONSABLE" | "COACH" }
   * Accessible au PRESIDENT et RESPONSABLE
   */
  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() addMemberDto: AddClubMemberDto
  ) {
    return this.clubsService.addMember(id, user.id, addMemberDto);
  }

  /**
   * DELETE /clubs/:id/members/:userId
   * Retirer un membre du club
   * Ne peut pas retirer le PRESIDENT (il doit transférer d'abord)
   * Accessible au PRESIDENT et RESPONSABLE (avec restrictions)
   */
  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') clubId: string,
    @Param('userId') memberIdToRemove: string,
    @CurrentUser() user: any
  ) {
    return this.clubsService.removeMember(clubId, user.id, memberIdToRemove);
  }

  /**
   * PATCH /clubs/:id/members/:userId
   * Changer le rôle d'un membre
   * Body: { role: "RESPONSABLE" | "COACH" }
   * Hiérarchie: PRESIDENT peut changer RESPONSABLE/COACH, 
   *             RESPONSABLE peut changer COACH
   */
  @Patch(':id/members/:userId')
  updateMemberRole(
    @Param('id') clubId: string,
    @Param('userId') memberIdToUpdate: string,
    @CurrentUser() user: any,
    @Body() updateRoleDto: UpdateClubMemberRoleDto
  ) {
    return this.clubsService.updateMemberRole(
      clubId, 
      user.id, 
      memberIdToUpdate, 
      updateRoleDto
    );
  }

  // ==================== ACTIONS SPÉCIALES ====================

  /**
   * POST /clubs/:id/transfer-presidency
   * Transférer la présidence à un autre membre
   * Body: { new_president_user_id: "uuid" }
   * L'ancien président devient RESPONSABLE automatiquement
   * Réservé au PRESIDENT uniquement
   */
  @Post(':id/transfer-presidency')
  transferPresidency(
    @Param('id') clubId: string,
    @CurrentUser() user: any,
    @Body() transferDto: TransferPresidencyDto
  ) {
    return this.clubsService.transferPresidency(clubId, user.id, transferDto);
  }

  /**
   * DELETE /clubs/:id/leave
   * Quitter un club
   * Le PRESIDENT ne peut pas quitter (il doit d'abord transférer)
   * Accessible à tous les membres sauf PRESIDENT
   */
  @Delete(':id/leave')
  leaveClub(
    @Param('id') clubId: string,
    @CurrentUser() user: any
  ) {
    return this.clubsService.leaveClub(clubId, user.id);
  }
}