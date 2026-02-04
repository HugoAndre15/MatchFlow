import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}
  
  create(createPlayerDto: CreatePlayerDto) {
    return this.prisma.player.create({
        data: {
          first_name: createPlayerDto.first_name,
          last_name: createPlayerDto.last_name,
          position: createPlayerDto.position,
          strong_foot: createPlayerDto.strong_foot,
          jersey_number: createPlayerDto.jersey_number,
          status: createPlayerDto.status,
          team_id: createPlayerDto.team_id,
          user_id: createPlayerDto.user_id,
        },
    });
  }

  findAll() {
    return this.prisma.player.findMany();
  }

  findOne(id: string) {
    return this.prisma.player.findUnique({
      where: { id },
    });
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto) {
    return this.prisma.player.update({
        where: { id },
        data: {
          first_name: updatePlayerDto.first_name,
          last_name: updatePlayerDto.last_name,
          position: updatePlayerDto.position,
          strong_foot: updatePlayerDto.strong_foot,
          jersey_number: updatePlayerDto.jersey_number,
          status: updatePlayerDto.status,
        },
    });
  }

  remove(id: string) {
    return this.prisma.player.delete({
      where: { id },
    });
  }
}
