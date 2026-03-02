import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: false, // Don't reject, just strip extra props
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((err) =>
          err.constraints ? Object.values(err.constraints) : [],
        );
        return new BadRequestException({
          statusCode: 400,
          error: 'Validation failed',
          message:
            messages.length === 1 ? messages[0] : messages,
        });
      },
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
