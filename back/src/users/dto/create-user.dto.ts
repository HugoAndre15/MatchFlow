import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@matchflow.com', description: 'Adresse email' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'MotDePasse123!', description: 'Mot de passe (min 8 caractères)', minLength: 8 })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: 'Jean', description: 'Prénom' })
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @ApiProperty({ example: 'Dupont', description: 'Nom de famille' })
    @IsString()
    @IsNotEmpty()
    last_name: string;
}
