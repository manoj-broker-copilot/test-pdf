import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { useAzureMonitor } from '@azure/monitor-opentelemetry';
import { AppModule } from './app.module';
import validationOptions from './common/utils/validation-options';
import { ResponseFormatterInterceptor } from './common/interceptors/response.interceptor';
import { GlobalHttpExceptionFilter } from './common/filters/global-http-exception.filter';

/***
 * TODO Enable after fixing version error
 ***/
// useAzureMonitor({
//   azureMonitorExporterOptions: {
//     connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
//   },
//   samplingRatio: 1.0,
// });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  const config = new DocumentBuilder()
    .setTitle('BROKER COPILOT API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addTag('admin copilot')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatterInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();
  // app.useLogger(logger);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
