import { IsEnum } from 'class-validator';
import { MatchPlayerStatus } from './add-players-to-match.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMatchPlayerDto {
  @ApiProperty({ enum: MatchPlayerStatus, example: 'SUBSTITUTE', description: 'Nouveau statut du joueur' })
  @IsEnum(MatchPlayerStatus)
  status: MatchPlayerStatus;
}