import { IsEnum } from 'class-validator';
import { club_role } from '@prisma/client';

export class UpdateClubMemberRoleDto {
    @IsEnum(club_role)
    role: club_role;
}