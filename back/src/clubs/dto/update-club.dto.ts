import { PartialType } from '@nestjs/swagger';
import { CreateClubDto } from './create-club.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClubDto extends PartialType(CreateClubDto) {
    @ApiPropertyOptional({ example: 'FC Lyon', description: 'Nouveau nom du club' })
    @IsOptional()
    @IsString()
    name?: string;
}
