// back/src/auth/dto/auth.dto.ts
export class RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  access_token: string;
}