import { IsString, IsNotEmpty, MinLength, IsInt, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { position, strong_foot, player_status } from '@prisma/client';

export class CreatePlayerDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    last_name: string;

    @IsEnum(position)
    @IsOptional()
    position?: position;

    @IsEnum(strong_foot)
    @IsOptional()
    strong_foot?: strong_foot;

    @IsInt()
    @IsOptional()
    jersey_number?: number;

    @IsEnum(player_status)
    @IsOptional()
    status?: player_status;

    @IsUUID()
    @IsNotEmpty()
    team_id: string;

    @IsUUID()
    @IsOptional()
    user_id?: string;
}