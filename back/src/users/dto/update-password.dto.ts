import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'AncienMDP123!', description: 'Mot de passe actuel', minLength: 8 })
  @IsString()
  @MinLength(8)
  current_password: string;

  @ApiProperty({ example: 'NouveauMDP456!', description: 'Nouveau mot de passe', minLength: 8 })
  @IsString()
  @MinLength(8)
  new_password: string;
}