import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { position, strong_foot, player_status } from '@prisma/client';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsUUID()
  @IsNotEmpty()
  team_id: string;

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