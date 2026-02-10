import { IsEnum } from 'class-validator';
import { MatchPlayerStatus } from './add-players-to-match.dto';

export class UpdateMatchPlayerDto {
  @IsEnum(MatchPlayerStatus)
  status: MatchPlayerStatus;
}