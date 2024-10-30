import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { addSwagger } from './docs/addSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  addSwagger(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
