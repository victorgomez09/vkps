import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://solid-goggles-4g9xjgp7497fj9g9-4200.app.github.dev',
  });

  await app.listen(3000);
}
bootstrap();
