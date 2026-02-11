import { IsEnum } from 'class-validator';
import { match_status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMatchStatusDto {
  @ApiProperty({ enum: ['UPCOMING', 'LIVE', 'FINISHED'], example: 'LIVE', description: 'Nouveau statut du match (UPCOMING → LIVE → FINISHED)' })
  @IsEnum(match_status)
  status: match_status;
}