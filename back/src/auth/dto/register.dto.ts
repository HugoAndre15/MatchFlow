import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'coach@matchflow.com', description: 'Adresse email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'MotDePasse123!', description: 'Mot de passe (min 8 caractères)', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Jean', description: 'Prénom' })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Dupont', description: 'Nom de famille' })
  @IsNotEmpty()
  last_name: string;
}
