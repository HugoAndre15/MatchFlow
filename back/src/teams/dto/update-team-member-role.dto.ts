import { IsEnum } from 'class-validator';
import { team_role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeamMemberRoleDto {
    @ApiProperty({ enum: ['COACH', 'ASSISTANT_COACH'], example: 'COACH', description: 'Nouveau rôle du membre' })
    @IsEnum(team_role)
    role: team_role;
}