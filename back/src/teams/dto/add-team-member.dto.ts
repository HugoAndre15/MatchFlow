import { IsUUID, IsEnum } from 'class-validator';
import { team_role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AddTeamMemberDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID de l\'utilisateur à ajouter' })
    @IsUUID()
    user_id: string;

    @ApiProperty({ enum: ['COACH', 'ASSISTANT_COACH'], example: 'ASSISTANT_COACH', description: 'Rôle dans l\'équipe' })
    @IsEnum(team_role)
    role: team_role;
}