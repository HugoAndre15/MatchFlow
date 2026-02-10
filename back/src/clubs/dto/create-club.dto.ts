import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateClubDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;
}