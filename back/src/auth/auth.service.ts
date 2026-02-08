import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const user = await this.usersService.create(registerDto);
        
        // Générer un token JWT pour l'utilisateur nouvellement créé
        const payload = { sub: user.id, email: user.email };
        const access_token = this.jwtService.sign(payload);
        
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        };
    }

    async login(loginDto: LoginDto) {
        // Récupérer l'utilisateur avec le password_hash
        const user = await this.usersService.findByEmailWithPassword(loginDto.email);
        
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password_hash,
        );
        
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        // Générer le token JWT
        const payload = { sub: user.id, email: user.email };
        const access_token = this.jwtService.sign(payload);
        
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        };
    }
    
    async validateUser(userId: string) {
        return this.usersService.findOne(userId);
    }
}
