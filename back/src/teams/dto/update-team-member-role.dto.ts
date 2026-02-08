//role
import { IsEnum } from 'class-validator';
import { team_role } from '@prisma/client';

export class UpdateTeamMemberRoleDto {
    @IsEnum(team_role)
    role: team_role;
}