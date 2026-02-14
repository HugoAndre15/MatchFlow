import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTeamDto {
    @ApiPropertyOptional({ example: 'U17 Loisir', description: 'Nouveau nom', minLength: 3 })
    @IsOptional()
    @IsString()
    @MinLength(3)
    name?: string;

    @ApiPropertyOptional({ example: 'U17', description: 'Nouvelle catégorie' })
    @IsOptional()
    @IsString()
    category?: string;
}
