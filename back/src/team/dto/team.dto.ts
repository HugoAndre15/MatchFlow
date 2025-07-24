// back/src/team/dto/team.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Nom de l\'équipe requis' })
  name: string;

  @IsOptional()
  @IsString({ message: 'La catégorie doit être une chaîne de caractères' })
  category?: string;

  @IsOptional()
  @IsString({ message: 'Les couleurs domicile doivent être une chaîne de caractères' })
  homeColors?: string;

  @IsOptional()
  @IsString({ message: 'Les couleurs extérieur doivent être une chaîne de caractères' })
  awayColors?: string;

  @IsOptional()
  @IsString({ message: 'Le stade doit être une chaîne de caractères' })
  stadium?: string;
}

export class UpdateTeamDto {
  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'La catégorie doit être une chaîne de caractères' })
  category?: string;

  @IsOptional()
  @IsString({ message: 'Les couleurs domicile doivent être une chaîne de caractères' })
  homeColors?: string;

  @IsOptional()
  @IsString({ message: 'Les couleurs extérieur doivent être une chaîne de caractères' })
  awayColors?: string;

  @IsOptional()
  @IsString({ message: 'Le stade doit être une chaîne de caractères' })
  stadium?: string;
}