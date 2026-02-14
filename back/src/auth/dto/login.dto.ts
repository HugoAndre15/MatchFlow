import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'coach@matchflow.com', description: 'Adresse email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'MotDePasse123!', description: 'Mot de passe', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}