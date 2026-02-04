import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTeamDto: CreateTeamDto) {
    return this.prisma.team.create({
        data: createTeamDto,
    });
  }

  findAll() {
    return this.prisma.team.findMany();
  }

  findOne(id: string) {
    return this.prisma.team.findUnique({
      where: { id },
    });
  }

  findPlayers(id: string) {
    return this.prisma.player.findMany({
      where: { team_id: id },
    });
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.prisma.team.update({
        where: { id },
        data: updateTeamDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.team.delete({
      where: { id },
    });
  }
}
