import { IsString, IsNotEmpty, IsOptional, IsUUID, MinLength } from 'class-validator';

export class CreateTeamDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsUUID()
    @IsNotEmpty()
    club_id: string;

    @IsOptional()
    @IsUUID()
    coach_user_id?: string;
}
