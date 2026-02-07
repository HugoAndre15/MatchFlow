import { PartialType } from '@nestjs/mapped-types';
import { CreateClubDto } from './create-club.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateClubDto extends PartialType(CreateClubDto) {
    @IsOptional()
    @IsString()
    name?: string;
}
