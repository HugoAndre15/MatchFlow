import { IsUUID, IsEnum } from 'class-validator';
import { team_role } from '@prisma/client';

export class AddTeamMemberDto {
    @IsUUID()
    user_id: string;
    
    @IsEnum(team_role)
    role: team_role;
}