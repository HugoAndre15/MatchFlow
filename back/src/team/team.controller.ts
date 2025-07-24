// back/src/team/team.controller.ts
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
  ValidationPipe 
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Request() req, @Body(ValidationPipe) createTeamDto: CreateTeamDto) {
    return this.teamService.create(req.user.id, createTeamDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.teamService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.teamService.findOne(id, req.user.id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string, @Request() req) {
    return this.teamService.getTeamStats(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(id, req.user.id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.teamService.remove(id, req.user.id);
  }
}