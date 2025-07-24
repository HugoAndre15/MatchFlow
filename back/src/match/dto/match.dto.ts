// back/src/match/dto/match.dto.ts
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsArray, ValidateNested, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MatchLocation, MatchPosition, MatchStatus, CardType } from '@prisma/client';

export class CreateMatchDto {
  @IsString({ message: 'L\'adversaire doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Adversaire requis' })
  opponent: string;

  @IsNotEmpty({ message: 'Date requise' })
  date: Date;

  @IsEnum(MatchLocation, { message: 'Lieu invalide' })
  location: MatchLocation;

  @IsString({ message: 'L\'ID de l\'équipe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID de l\'équipe requis' })
  teamId: string;
}

export class UpdateMatchDto {
  @IsOptional()
  @IsString({ message: 'L\'adversaire doit être une chaîne de caractères' })
  opponent?: string;

  @IsOptional()
  date?: Date;

  @IsOptional()
  @IsEnum(MatchLocation, { message: 'Lieu invalide' })
  location?: MatchLocation;

  @IsOptional()
  @IsEnum(MatchStatus, { message: 'Statut invalide' })
  status?: MatchStatus;

  @IsOptional()
  @IsNumber({}, { message: 'Le score doit être un nombre' })
  @Min(0, { message: 'Le score ne peut pas être négatif' })
  ourScore?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Le score doit être un nombre' })
  @Min(0, { message: 'Le score ne peut pas être négatif' })
  opponentScore?: number;
}

class StarterDto {
  @IsString({ message: 'L\'ID du joueur doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du joueur requis' })
  playerId: string;

  @IsEnum(MatchPosition, { message: 'Position invalide' })
  position: MatchPosition;
}

class SubstituteDto {
  @IsString({ message: 'L\'ID du joueur doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du joueur requis' })
  playerId: string;
}

export class MatchCompositionDto {
  @IsString({ message: 'L\'ID du match doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du match requis' })
  matchId: string;

  @IsArray({ message: 'Les titulaires doivent être un tableau' })
  @ValidateNested({ each: true })
  @Type(() => StarterDto)
  starters: StarterDto[];

  @IsArray({ message: 'Les remplaçants doivent être un tableau' })
  @ValidateNested({ each: true })
  @Type(() => SubstituteDto)
  substitutes: SubstituteDto[];
}

export class AddGoalDto {
  @IsString({ message: 'L\'ID du match doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du match requis' })
  matchId: string;

  @IsString({ message: 'L\'ID du joueur doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du joueur requis' })
  playerId: string;

  @IsNumber({}, { message: 'La minute doit être un nombre' })
  @Min(0, { message: 'La minute ne peut pas être négative' })
  minute: number;

  @IsOptional()
  @IsBoolean({ message: 'isOwnGoal doit être un booléen' })
  isOwnGoal?: boolean;
}

export class AddAssistDto {
  @IsString({ message: 'L\'ID du match doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du match requis' })
  matchId: string;

  @IsString({ message: 'L\'ID du joueur doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du joueur requis' })
  playerId: string;

  @IsNumber({}, { message: 'La minute doit être un nombre' })
  @Min(0, { message: 'La minute ne peut pas être négative' })
  minute: number;
}

export class AddCardDto {
  @IsString({ message: 'L\'ID du match doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du match requis' })
  matchId: string;

  @IsString({ message: 'L\'ID du joueur doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du joueur requis' })
  playerId: string;

  @IsEnum(CardType, { message: 'Type de carton invalide' })
  type: CardType;

  @IsNumber({}, { message: 'La minute doit être un nombre' })
  @Min(0, { message: 'La minute ne peut pas être négative' })
  minute: number;

  @IsOptional()
  @IsString({ message: 'La raison doit être une chaîne de caractères' })
  reason?: string;
}

export class AddSubstitutionDto {
  @IsString({ message: 'L\'ID du match doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du match requis' })
  matchId: string;

  @IsString({ message: 'L\'ID du joueur qui entre doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du joueur qui entre requis' })
  playerInId: string;

  @IsString({ message: 'L\'ID du joueur qui sort doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'ID du joueur qui sort requis' })
  playerOutId: string;

  @IsNumber({}, { message: 'La minute doit être un nombre' })
  @Min(0, { message: 'La minute ne peut pas être négative' })
  minute: number;
}