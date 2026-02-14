/**
 * 📖 GUIDE D'UTILISATION DE ConfigService
 * 
 * Ce fichier montre comment accéder aux variables d'environnement
 * de manière typée et sécurisée dans vos services.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';

@Injectable()
export class ExampleService {
  constructor(
    // ✅ Injecter ConfigService avec le type de votre classe de validation
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  exampleMethod() {
    // 🔍 MÉTHODE 1 : get() avec typage automatique
    const dbUrl = this.configService.get('DATABASE_URL');
    // Type: string | undefined
    
    // 🔍 MÉTHODE 2 : get() avec type explicite
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    // Type: string | undefined
    
    // 🔍 MÉTHODE 3 : getOrThrow() - Lance une erreur si la variable n'existe pas
    const nodeEnv = this.configService.getOrThrow('NODE_ENV');
    // Type: string (jamais undefined car lance une exception sinon)

    // 🔍 MÉTHODE 4 : get() avec valeur par défaut
    const port = this.configService.get('PORT', 3000);
    // Type: string | number (selon la valeur par défaut)

    console.log('Database URL:', dbUrl);
    console.log('JWT Secret:', jwtSecret);
    console.log('Environment:', nodeEnv);
    console.log('Port:', port);
  }
}

/**
 * 💡 EXEMPLES CONCRETS D'UTILISATION
 */

// ✅ Dans un Service
@Injectable()
export class DatabaseService {
  constructor(private config: ConfigService<EnvironmentVariables>) {
    const dbUrl = this.config.getOrThrow('DATABASE_URL');
    console.log('Connecting to:', dbUrl);
  }
}

// ✅ Dans un Guard
@Injectable()
export class JwtAuthGuard {
  constructor(private config: ConfigService<EnvironmentVariables>) {
    const secret = this.config.getOrThrow('JWT_SECRET');
    // Utilisé pour vérifier les tokens
  }
}

// ✅ Dans un Controller
@Injectable()
export class AppController {
  constructor(private config: ConfigService<EnvironmentVariables>) {}

  getConfig() {
    return {
      env: this.config.get('NODE_ENV'),
      port: this.config.get('PORT'),
    };
  }
}
