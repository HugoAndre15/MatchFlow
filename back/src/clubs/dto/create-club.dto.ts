import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateClubDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
