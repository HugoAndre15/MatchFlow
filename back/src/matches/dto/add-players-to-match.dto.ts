import { IsArray, ArrayNotEmpty, ValidateNested, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum MatchPlayerStatus {
  STARTER = 'STARTER',
  SUBSTITUTE = 'SUBSTITUTE',
}

export class PlayerToAddDto {
  @IsUUID()
  player_id: string;

  @IsEnum(MatchPlayerStatus)
  status: MatchPlayerStatus;
}

export class AddPlayersToMatchDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlayerToAddDto)
  players: PlayerToAddDto[];
}