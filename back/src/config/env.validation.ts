import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, validateSync } from 'class-validator';

/**
 * 🔧 CONFIGURATION DES VARIABLES D'ENVIRONNEMENT
 * 
 * Ce fichier définit et valide TOUTES les variables d'environnement requises.
 * Si une variable manque ou est invalide, l'application refuse de démarrer.
 *
 */

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
   // 🗄️ DATABASE_URL

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

   // 🔐 JWT_SECRET

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

   // ⏱️ JWT_EXPIRES_IN
  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string;


   // 🌍 NODE_ENV

  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

   // 🔌 PORT

  @IsString()
  PORT: string = '3000';
}

/**
 * 🔍 FONCTION DE VALIDATION
 * @throws Error si une validation échoue
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true, // Convertit les strings en types appropriés
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false, // Vérifie que toutes les propriétés requises sont présentes
  });

  if (errors.length > 0) {
    throw new Error(`❌ ERREUR DE CONFIGURATION\n\n${errors.map(err => 
      `Variable: ${err.property}\nProblème: ${Object.values(err.constraints || {}).join(', ')}`
    ).join('\n\n')}`);
  }

  return validatedConfig;
}
