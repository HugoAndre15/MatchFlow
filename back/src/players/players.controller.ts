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
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('players')
@UseGuards(JwtAuthGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  /**
   * POST /players
   * Créer un joueur de football
   * Body: { first_name, last_name, team_id, position?, jersey_number?, strong_foot?, status? }
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Post()
  create(
    @Body() createPlayerDto: CreatePlayerDto,
    @CurrentUser() user: any
  ) {
    return this.playersService.create(createPlayerDto, user.id);
  }

  /**
   * GET /players?teamId=xxx&page=1&limit=20&search=dupont&status=ACTIVE&position=GOALKEEPER&sortBy=last_name&order=asc
   * Lister tous les joueurs d'une équipe avec pagination, filtres, recherche et tri
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Get()
  findAll(
    @Query('teamId') teamId: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Query('status') status?: string,
    @Query('position') position?: string,
    @CurrentUser() user?: any
  ) {
    return this.playersService.findAll(teamId, user.id, paginationQuery, status, position);
  }

    /**
   * GET /players/:id/stats
   * Récupérer les statistiques agrégées d'un joueur
   * (buts, passes, cartons, convocations, répartition par zone/pied)
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Get(':id/stats')
  getPlayerStats(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.playersService.getPlayerStats(id, user.id);
  }

  /**
   * GET /players/:id
   * Récupérer un joueur par ID
   * Inclut les infos de la team et du club
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.playersService.findOne(id, user.id);
  }

  /**
   * PATCH /players/:id
   * Modifier un joueur (y compris changer d'équipe)
   * Body: { first_name?, last_name?, team_id?, position?, jersey_number?, strong_foot?, status? }
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   * Note: Si team_id change, vérifie les permissions sur les 2 équipes
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updatePlayerDto: UpdatePlayerDto
  ) {
    return this.playersService.update(id, user.id, updatePlayerDto);
  }

  /**
   * DELETE /players/:id
   * Supprimer un joueur
   * Permissions: COACH, ASSISTANT_COACH ou PRESIDENT du club
   */
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.playersService.remove(id, user.id);
  }
}