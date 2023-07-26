import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 5000;
  app.enableCors({
    origin: '*', // You can set this to your specific frontend URL or configure it based on your requirements
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Set this to true if you need to allow credentials (cookies, HTTP authentication) to be included in CORS requests
  });

  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
}
bootstrap();
