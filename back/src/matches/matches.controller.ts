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
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { UpdateMatchStatusDto } from './dto/update-match-status.dto';
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