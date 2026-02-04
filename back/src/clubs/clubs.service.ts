import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createClubDto: CreateClubDto) {
    return this.prisma.club.create({
        data: createClubDto,
    });
  }

  findAll() {
    return this.prisma.club.findMany();
  }

  findOne(id: string) {
    return this.prisma.club.findUnique({
      where: { id },
    });
  }

  update(id: string, updateClubDto: UpdateClubDto) {
    return this.prisma.club.update({
        where: { id },
        data: updateClubDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.club.delete({
        where: { id },
    });
  }
}
