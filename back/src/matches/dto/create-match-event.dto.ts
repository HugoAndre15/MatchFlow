import { IsUUID, IsNotEmpty, IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';
import { match_event_type, field_zone, body_part } from '@prisma/client';

export class CreateMatchEventDto {
  @IsUUID()
  @IsNotEmpty()
  player_id: string;

  @IsEnum(match_event_type)
  event_type: match_event_type;

  @IsInt()
  @Min(0)
  @Max(120)
  minute: number;

  @IsOptional()
  @IsEnum(field_zone)
  zone?: field_zone;

  @IsOptional()
  @IsEnum(body_part)
  body_part?: body_part;

  @IsOptional()
  @IsUUID()
  related_event_id?: string;
}