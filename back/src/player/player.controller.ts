// back/src/player/player.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  ValidationPipe,
  Query 
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto, UpdatePlayerDto } from './dto/player.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('players')
@UseGuards(JwtAuthGuard)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Request() req, @Body(ValidationPipe) createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(req.user.id, createPlayerDto);
  }

  @Get()
  findAll(@Query('teamId') teamId: string, @Request() req) {
    return this.playerService.findAll(teamId, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.playerService.findOne(id, req.user.id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string, @Request() req) {
    return this.playerService.getPlayerStats(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) updatePlayerDto: UpdatePlayerDto,
  ) {
    return this.playerService.update(id, req.user.id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.playerService.remove(id, req.user.id);
  }
}