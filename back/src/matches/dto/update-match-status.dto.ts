import { IsEnum } from 'class-validator';
import { match_status } from '@prisma/client';

export class UpdateMatchStatusDto {
  @IsEnum(match_status)
  status: match_status; // UPCOMING, LIVE, FINISHED
}