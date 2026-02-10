import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateTeamDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    name?: string;

    @IsOptional()
    @IsString()
    category?: string;
}
