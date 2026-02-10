import { IsUUID, IsEnum } from 'class-validator';
import { club_role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AddClubMemberDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID de l\'utilisateur à ajouter' })
    @IsUUID()
    userId: string;

    @ApiProperty({ enum: ['PRESIDENT', 'RESPONSABLE', 'COACH'], example: 'COACH', description: 'Rôle dans le club' })
    @IsEnum(club_role)
    role: club_role;
}