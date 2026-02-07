import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrait "Bearer <token>" du header
            ignoreExpiration: false, // Rejette les tokens expirés
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const user = await this.authService.validateUser(payload.sub);
        
        if (!user) {
            throw new UnauthorizedException();
        }
        
        // Cet objet sera attaché à request.user
        return user;
    }
}