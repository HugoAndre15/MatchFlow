import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubsService.create(createClubDto);
  }

  @Post(':id/users')
  createUserInClub(@Param('id') clubId: string, @Body() createUserDto: any) {
      return this.clubsService.addUserToClub(clubId, createUserDto);
  }

  @Get()
  findAll() {
    return this.clubsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Get(':id/users')
  findUsersInClub(@Param('id') clubId: string) {
    return this.clubsService.findUsersInClub(clubId);
  }

  @Get(':id/teams')
  findTeamsInClub(@Param('id') clubId: string) {
    return this.clubsService.findTeamsInClub(clubId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubsService.update(id, updateClubDto);
  }

  @Patch(':id/users/:userId')
  updateUserRoleInClub(@Param('id') clubId: string, @Param('userId') userId: string, @Body() updateUserDto: any) {
    return this.clubsService.updateUserRoleInClub(clubId, userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubsService.remove(id);
  }

  @Delete(':id/users/:userId')
  removeUserFromClub(@Param('id') clubId: string, @Param('userId') userId: string) {
      return this.clubsService.removeUserFromClub(clubId, userId);
  }
}