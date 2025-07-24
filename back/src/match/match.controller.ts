// back/src/match/match.controller.ts
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
import { MatchService } from './match.service';
import { 
  CreateMatchDto, 
  UpdateMatchDto, 
  MatchCompositionDto, 
  AddGoalDto, 
  AddAssistDto, 
  AddCardDto, 
  AddSubstitutionDto 
} from './dto/match.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  create(@Request() req, @Body(ValidationPipe) createMatchDto: CreateMatchDto) {
    return this.matchService.create(req.user.id, createMatchDto);
  }

  @Get()
  findAll(@Query('teamId') teamId: string, @Request() req) {
    return this.matchService.findAll(teamId, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.matchService.findOne(id, req.user.id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string, @Request() req) {
    return this.matchService.getMatchStats(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchService.update(id, req.user.id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.matchService.remove(id, req.user.id);
  }

  @Post(':id/composition')
  setComposition(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) compositionDto: MatchCompositionDto,
  ) {
    compositionDto.matchId = id;
    return this.matchService.setComposition(req.user.id, compositionDto);
  }

  @Post(':id/start')
  startMatch(@Param('id') id: string, @Request() req) {
    return this.matchService.startMatch(id, req.user.id);
  }

  @Post(':id/end')
  endMatch(@Param('id') id: string, @Request() req) {
    return this.matchService.endMatch(id, req.user.id);
  }

  @Post(':id/goal')
  addGoal(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) goalDto: AddGoalDto,
  ) {
    goalDto.matchId = id;
    return this.matchService.addGoal(req.user.id, goalDto);
  }

  @Post(':id/assist')
  addAssist(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) assistDto: AddAssistDto,
  ) {
    assistDto.matchId = id;
    return this.matchService.addAssist(req.user.id, assistDto);
  }

  @Post(':id/card')
  addCard(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) cardDto: AddCardDto,
  ) {
    cardDto.matchId = id;
    return this.matchService.addCard(req.user.id, cardDto);
  }

  @Post(':id/substitution')
  addSubstitution(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) substitutionDto: AddSubstitutionDto,
  ) {
    substitutionDto.matchId = id;
    return this.matchService.addSubstitution(req.user.id, substitutionDto);
  }
}