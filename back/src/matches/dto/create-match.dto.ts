import { IsString, IsNotEmpty, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { match_location } from '@prisma/client';

export class CreateMatchDto {
  @IsUUID()
  @IsNotEmpty()
  team_id: string;

  @IsString()
  @IsNotEmpty()
  opponent: string;

  @IsEnum(match_location)
  location: match_location; // HOME ou AWAY

  @IsDateString()
  match_date: string; // Format ISO: "2026-02-08T15:00:00Z"
}