import { Controller, Get, Body, Patch, Param, Delete, UseGuards, ForbiddenException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('users')
@UseGuards(JwtAuthGuard) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Route pour récupérer son propre profil
  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  // Route pour modifier son propre profil
  @Patch('me')
  updateProfile(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  // Route pour modifier son propre mot de passe
  @Patch('me/password')
  updateMyPassword(
    @CurrentUser() user: any,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    return this.usersService.updatePassword(user.id, updatePasswordDto);
  }

  // Liste tous les utilisateurs avec pagination et recherche (TODO: réserver aux admins)
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.usersService.findAll(paginationQuery);
  }

  // Récupère un utilisateur par ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Modifier un utilisateur (vérifie que c'est bien son propre compte)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto
  ) {
    if (user.id !== id) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre propre profil');
    }
    return this.usersService.update(id, updateUserDto);
  }

  // Modifier le mot de passe (vérifie que c'est bien son propre compte)
  @Patch(':id/password')
  updatePassword(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    if (user.id !== id) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre propre mot de passe');
    }
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  // Supprimer un compte (vérifie que c'est bien son propre compte)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    if (user.id !== id) {
      throw new ForbiddenException('Vous ne pouvez supprimer que votre propre compte');
    }
    return this.usersService.remove(id);
  }
}
