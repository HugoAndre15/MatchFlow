import { IsEnum } from 'class-validator';
import { club_role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClubMemberRoleDto {
    @ApiProperty({ enum: ['PRESIDENT', 'RESPONSABLE', 'COACH'], example: 'RESPONSABLE', description: 'Nouveau rôle du membre' })
    @IsEnum(club_role)
    role: club_role;
}