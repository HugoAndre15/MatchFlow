import { IsString, IsNotEmpty, IsOptional, IsUUID, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {

    @ApiProperty({ example: 'U15 Elite', description: 'Nom de l\'équipe (min 3 caractères)', minLength: 3 })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @ApiProperty({ example: 'U15', description: 'Catégorie de l\'équipe' })
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID du club parent' })
    @IsUUID()
    @IsNotEmpty()
    club_id: string;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'UUID du coach (optionnel, sinon le créateur)' })
    @IsOptional()
    @IsUUID()
    coach_user_id?: string;
}
