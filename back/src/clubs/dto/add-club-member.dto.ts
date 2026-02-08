import { IsUUID, IsEnum } from 'class-validator';

import { club_role } from '@prisma/client';

export class AddClubMemberDto {
    @IsUUID()
    userId: string;

    @IsEnum(club_role)
    role: club_role;
}