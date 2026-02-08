import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { UpdateMatchStatusDto } from './dto/update-match-status.dto';
import { AddPlayersToMatchDto } from './dto/add-players-to-match.dto';
import { UpdateMatchPlayerDto } from './dto/update-match-player.dto';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { UpdateMatchEventDto } from './dto/update-match-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  /**
   * POST /matches
   * Créer un nouveau match
   * Body: { team_id, opponent, location, match_date }
   * Status sera UPCOMING par défaut
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Post()
  create(
    @Body() createMatchDto: CreateMatchDto,
    @CurrentUser() user: any
  ) {
    return this.matchesService.create(createMatchDto, user.id);
  }

  /**
   * GET /matches?teamId=xxx
   * Lister tous les matchs d'une équipe
   * Triés par date décroissante (plus récents en premier)
   * Permissions: Tous les membres du club
   */
  @Get()
  findAll(
    @Query('teamId') teamId: string,
    @CurrentUser() user: any
  ) {
    return this.matchesService.findAll(teamId, user.id);
  }

  // ==================== GESTION DES JOUEURS CONVOQUÉS ====================
  // NOTE: Ces routes doivent être AVANT les routes génériques (:id) pour le routing correct

  /**
   * POST /matches/:id/players
   * Convoquer des joueurs pour un match
   * Body: { players: [{ player_id, status: "STARTER" | "SUBSTITUTE" }] }
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Post(':id/players')
  addPlayersToMatch(
    @Param('id') id: string,
    @Body() addPlayersDto: AddPlayersToMatchDto,
    @CurrentUser() user: any,
  ) {
    return this.matchesService.addPlayersToMatch(id, addPlayersDto, user.id);
  }

  /**
   * GET /matches/:id/players
   * Récupérer la liste des joueurs convoqués pour un match
   * Triés par status (STARTER puis SUBSTITUTE) puis par nom
   * Permissions: Tous les membres du club
   */
  @Get(':id/players')
  getMatchPlayers(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.matchesService.getMatchPlayers(id, user.id);
  }

  /**
   * PATCH /matches/:id/players/:playerId
   * Modifier le status d'un joueur convoqué (STARTER ↔ SUBSTITUTE)
   * Body: { status: "STARTER" | "SUBSTITUTE" }
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Patch(':id/players/:playerId')
  updateMatchPlayerStatus(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
    @Body() updateDto: UpdateMatchPlayerDto,
    @CurrentUser() user: any,
  ) {
    return this.matchesService.updateMatchPlayerStatus(id, playerId, updateDto, user.id);
  }

  /**
   * DELETE /matches/:id/players/:playerId
   * Retirer un joueur de la convocation
   * Bloqué si le joueur a des événements enregistrés
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Delete(':id/players/:playerId')
  removePlayerFromMatch(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
    @CurrentUser() user: any,
  ) {
    return this.matchesService.removePlayerFromMatch(id, playerId, user.id);
  }

    // ==================== GESTION DES ÉVÉNEMENTS ====================

  /**
   * POST /matches/:id/events
   * Ajouter un événement à un match
   * Body: { player_id, event_type, minute, zone?, body_part?, related_event_id? }
   * Si 2ème YELLOW_CARD → RED_CARD automatique
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Post(':id/events')
  addEventToMatch(
    @Param('id') id: string,
    @Body() createEventDto: CreateMatchEventDto,
    @CurrentUser() user: any,
  ) {
    return this.matchesService.addEventToMatch(id, createEventDto, user.id);
  }

  /**
   * GET /matches/:id/events
   * Récupérer tous les événements d'un match
   * Triés par minute croissante
   * Permissions: Tous les membres du club
   */
  @Get(':id/events')
  getMatchEvents(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.matchesService.getMatchEvents(id, user.id);
  }

  /**
   * PATCH /matches/:id/events/:eventId
   * Modifier un événement
   * Body: { player_id?, event_type?, minute?, zone?, body_part?, related_event_id? }
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Patch(':id/events/:eventId')
  updateMatchEvent(
    @Param('id') id: string,
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateMatchEventDto,
    @CurrentUser() user: any,
  ) {
    return this.matchesService.updateMatchEvent(id, eventId, updateEventDto, user.id);
  }

  /**
   * DELETE /matches/:id/events/:eventId
   * Supprimer un événement (si GOAL → supprime aussi les ASSIST liés)
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Delete(':id/events/:eventId')
  removeMatchEvent(
    @Param('id') id: string,
    @Param('eventId') eventId: string,
    @CurrentUser() user: any,
  ) {
    return this.matchesService.removeMatchEvent(id, eventId, user.id);
  }

  /**
   * PATCH /matches/:id/status
   * Changer le status du match
   * Body: { status: "UPCOMING" | "LIVE" | "FINISHED" }
   * Transitions autorisées: UPCOMING → LIVE → FINISHED (pas de retour)
   * Permissions: COACH ou PRESIDENT uniquement
   */
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateStatusDto: UpdateMatchStatusDto
  ) {
    return this.matchesService.updateStatus(id, user.id, updateStatusDto);
  }

  /**
   * GET /matches/:id
   * Récupérer les détails d'un match
   * Inclut: team, club, événements avec joueurs, score calculé
   * Permissions: Tous les membres du club
   */
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.matchesService.findOne(id, user.id);
  }

  /**
   * PATCH /matches/:id
   * Modifier un match (opponent, location, date)
   * Body: { opponent?, location?, match_date? }
   * Le status ne se modifie PAS ici (voir /matches/:id/status)
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateMatchDto: UpdateMatchDto
  ) {
    return this.matchesService.update(id, user.id, updateMatchDto);
  }

  /**
   * DELETE /matches/:id
   * Supprimer un match (cascade sur matchEvents)
   * Permissions: COACH ou PRESIDENT uniquement
   */
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.matchesService.remove(id, user.id);
  }
}