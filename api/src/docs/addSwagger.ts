import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as path from 'path';
import { writeFileSync, createWriteStream } from 'fs';

export const addSwagger = async (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle('Bill Tracker API')
    .addBearerAuth()
    .setDescription('Web service for invoices')
    .setVersion('1.0')
    .addTag('users', 'User details management')
    .addTag('auth', 'Authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-standalone-preset.js',
    ],
  });

  await app.use((req, res, next) => {
    // get the swagger json file (if app is running in development mode)
    if (process.env.NODE_ENV === 'development') {
      const outputPath = path.resolve(
        process.cwd(),
        'src',
        'docs',
        'swagger.json',
      );
      writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8' });
    }
    next();
  });
};
