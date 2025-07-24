// back/src/player/dto/player.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { PlayerStatus } from '@prisma/client';

export class CreatePlayerDto {
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Prénom requis' })
  firstName: string;

  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Nom requis' })
  lastName: string;

  @IsString({ message: 'La position doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Position requise' })
  position: string;

  @IsNumber({}, { message: 'Le numéro doit être un nombre' })
  @Min(1, { message: 'Le numéro doit être au minimum 1' })
  @Max(99, { message: 'Le numéro doit être au maximum 99' })
  number: number;

  @IsOptional()
  @IsEnum(PlayerStatus, { message: 'Statut invalide' })
  status?: PlayerStatus;

  @IsString({ message: 'L\'ID de l\'équipe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID de l\'équipe requis' })
  teamId: string;
}

export class UpdatePlayerDto {
  @IsOptional()
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'La position doit être une chaîne de caractères' })
  position?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Le numéro doit être un nombre' })
  @Min(1, { message: 'Le numéro doit être au minimum 1' })
  @Max(99, { message: 'Le numéro doit être au maximum 99' })
  number?: number;

  @IsOptional()
  @IsEnum(PlayerStatus, { message: 'Statut invalide' })
  status?: PlayerStatus;
}