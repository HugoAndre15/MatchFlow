import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { match_location } from '@prisma/client';

export class UpdateMatchDto {
  @IsOptional()
  @IsString()
  opponent?: string;

  @IsOptional()
  @IsEnum(match_location)
  location?: match_location;

  @IsOptional()
  @IsDateString()
  match_date?: string;
}