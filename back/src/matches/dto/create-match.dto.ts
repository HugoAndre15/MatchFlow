import { IsString, IsNotEmpty, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { match_location } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID de l\'équipe' })
  @IsUUID()
  @IsNotEmpty()
  team_id: string;

  @ApiProperty({ example: 'Olympique Lyonnais', description: 'Nom de l\'adversaire' })
  @IsString()
  @IsNotEmpty()
  opponent: string;

  @ApiProperty({ enum: ['HOME', 'AWAY'], example: 'HOME', description: 'Lieu du match' })
  @IsEnum(match_location)
  location: match_location;

  @ApiProperty({ example: '2026-03-15T15:00:00Z', description: 'Date et heure du match (ISO 8601)' })
  @IsDateString()
  match_date: string;
}