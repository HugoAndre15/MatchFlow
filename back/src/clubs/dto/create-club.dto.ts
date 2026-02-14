import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClubDto {
    @ApiProperty({ example: 'FC Parisien', description: 'Nom du club (min 3 caractères)', minLength: 3 })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;
}