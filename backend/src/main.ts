import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { TokenAuthGuard } from './auth/token-auth.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe());

  const globalAuthGuard = app.get(TokenAuthGuard);
  app.useGlobalGuards(globalAuthGuard);

  app.useStaticAssets(path.join(__dirname, '..', '..', 'public'));
  app.setBaseViewsDir(path.join(__dirname, '..', '..', 'views'));

  app.setViewEngine('ejs');

  const config = new DocumentBuilder()
    .setTitle('Vizsgaremek API')
    .setDescription(
      'A Vizsgaremek projekt teljes API dokumentációja. Az API szerkezetezetten kezeli a felhasználókat, munkákat, feladatokat, eszközöket és a hozzájuk kapcsolódó adatokat.',
    )
    .setVersion('1.0.0')
    .addServer(process.env.API_URL || 'http://localhost:3000', 'Development')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token szükséges a védett végpontokhoz',
      },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .logo { display: none; }
    `,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
