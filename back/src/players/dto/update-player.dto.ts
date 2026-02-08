import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsUUID } from 'class-validator';
import { position, strong_foot, player_status } from '@prisma/client';

export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsUUID()
  team_id?: string; // ✅ Permet de changer d'équipe

  @IsOptional()
  @IsEnum(position)
  position?: position;

  @IsOptional()
  @IsEnum(strong_foot)
  strong_foot?: strong_foot;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  jersey_number?: number;

  @IsOptional()
  @IsEnum(player_status)
  status?: player_status;
}