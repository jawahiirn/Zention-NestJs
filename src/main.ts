import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // Strip any properties that are not defined in the DTO
      whitelist: true,
      // Automatically transform the payload to match the DTO instance
      transform: true,
      transformOptions: {
        // Automatically convert simple types (like strings to numbers in @Param)
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Zention API')
    .setDescription('The Zention API description')
    .setVersion('1.0')
    .addTag('zention')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
