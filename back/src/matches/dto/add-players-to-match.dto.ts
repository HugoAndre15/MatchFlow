import { IsArray, ArrayNotEmpty, ValidateNested, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum MatchPlayerStatus {
  STARTER = 'STARTER',
  SUBSTITUTE = 'SUBSTITUTE',
}

export class PlayerToAddDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID du joueur' })
  @IsUUID()
  player_id: string;

  @ApiProperty({ enum: MatchPlayerStatus, example: 'STARTER', description: 'Titulaire ou remplaçant' })
  @IsEnum(MatchPlayerStatus)
  status: MatchPlayerStatus;
}

export class AddPlayersToMatchDto {
  @ApiProperty({ type: [PlayerToAddDto], description: 'Liste des joueurs à convoquer' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlayerToAddDto)
  players: PlayerToAddDto[];
}