import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

const safeResponseFields = {
    id: true,
    email: true,
    first_name: true,
    last_name: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password_hash: hashedPassword,
          first_name: createUserDto.first_name,
          last_name: createUserDto.last_name,
        },
        select: {
            ...safeResponseFields,
        },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
        select:{ 
            ...safeResponseFields,
        },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        ...safeResponseFields,
      },
    });
  }

  // Méthode pour l'authentification qui inclut le password_hash
  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        ...safeResponseFields,
      },
    });
  }

    findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
        where: { id },
        data: updateUserDto as any,
        select: {
            ...safeResponseFields,
        },
    });
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    // Récupérer l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.current_password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(updatePasswordDto.new_password, 10);

    // Mettre à jour le mot de passe
    return this.prisma.user.update({
      where: { id },
      data: {
        password_hash: hashedPassword,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: {
        ...safeResponseFields,
      },
    });
  }
}
