//email, password, first_name, last_name
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;  

  @IsNotEmpty()
  first_name: string;  
  
  @IsNotEmpty()
  last_name: string;
}
