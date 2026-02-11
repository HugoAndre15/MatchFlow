import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Inscription', description: 'Créer un nouveau compte utilisateur' })
    @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
    @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Connexion', description: 'Se connecter et récupérer un token JWT' })
    @ApiResponse({ status: 200, description: 'Connexion réussie, retourne le token JWT' })
    @ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}