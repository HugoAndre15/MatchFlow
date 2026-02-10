import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { match_location } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMatchDto {
  @ApiPropertyOptional({ example: 'AS Monaco', description: 'Nom de l\'adversaire' })
  @IsOptional()
  @IsString()
  opponent?: string;

  @ApiPropertyOptional({ enum: ['HOME', 'AWAY'], example: 'AWAY', description: 'Lieu du match' })
  @IsOptional()
  @IsEnum(match_location)
  location?: match_location;

  @ApiPropertyOptional({ example: '2026-04-20T18:00:00Z', description: 'Nouvelle date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  match_date?: string;
}