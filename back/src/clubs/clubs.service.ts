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

  addUserToClub(clubId: string, createUserDto: any) {
      return this.prisma.clubUser.create({
          data: {
              club_id: clubId,
              user_id: createUserDto.user_id,
              role: createUserDto.role,
          },
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

  findUsersInClub(clubId: string) {
    return this.prisma.clubUser.findMany({
        where: { club_id: clubId },
        include: { user: true },
    });
  }

  findTeamsInClub(clubId: string) {
    return this.prisma.team.findMany({
        where: { club_id: clubId },
    });
  }

  update(id: string, updateClubDto: UpdateClubDto) {
    return this.prisma.club.update({
        where: { id },
        data: updateClubDto as any,
    });
  }

  updateUserRoleInClub(clubId: string, userId: string, updateUserDto: any) {
    return this.prisma.clubUser.update({
        where: {
            club_id_user_id: {
                club_id: clubId,
                user_id: userId,
            },
        },
        data: {
            role: updateUserDto.role,
        },
    });
  }

  remove(id: string) {
    return this.prisma.club.delete({
        where: { id },
    });
  }

  removeUserFromClub(clubId: string, userId: string) {
    return this.prisma.clubUser.delete({
        where: {
            club_id_user_id: {
                club_id: clubId,
                user_id: userId,
            },
        },
    });
  }
}
