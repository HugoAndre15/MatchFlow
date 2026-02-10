import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,           // Active class-transformer (convertit les query params string → number)
    whitelist: true,           // Supprime les propriétés non décorées
    forbidNonWhitelisted: false, // Ne bloque pas les propriétés inconnues (souplesse)
    transformOptions: {
      enableImplicitConversion: true, // Conversion automatique des types
    },
  }));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();