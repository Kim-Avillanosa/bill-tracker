import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { addSwagger } from './docs/addSwagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rawOrigins = process.env.CORS_ORIGINS ?? '';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use((req, res, next) => {
    const startedAt = Date.now();
    const { method, originalUrl } = req;

    res.on("finish", () => {
      const durationMs = Date.now() - startedAt;
      const payload = {
        method,
        path: originalUrl,
        statusCode: res.statusCode,
        durationMs,
      };
      console.log(JSON.stringify({ type: "http_request", ...payload }));
    });

    next();
  });

  addSwagger(app);

  await app.listen(process.env.PORT || 3005);
}
bootstrap();
