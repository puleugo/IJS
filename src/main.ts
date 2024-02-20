import {
	ClassSerializerInterceptor, INestApplication, ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector, } from '@nestjs/core';
import { SwaggerModule, } from '@nestjs/swagger';

import { MainModule, } from './main.module';

import generateSwaggerDocument from '@common/swagger/swagger.generator';
import { API_PREFIX, } from '@common/type/contants';
import { NestFastifyApplication, } from '@nestjs/platform-fastify';
import { LoggerService, } from '@common/utils/logger.service';

(async (): Promise<void> => {
	// Initialize app with root module
	const app: INestApplication =
    await NestFactory.create<NestFastifyApplication>(
    	MainModule, { logger: new LoggerService, }
    );

	// Create swagger document
	SwaggerModule.setup(
		`${API_PREFIX}/docs`, app, generateSwaggerDocument(app), { swaggerOptions: { persistAuthorization: true, }, }
	);

	// Apply rules for validation
	app.useGlobalInterceptors(
		new ClassSerializerInterceptor(app.get(Reflector))
	).useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	);

	// Apply CORS
	app.enableCors({
		origin: true,
		credentials: true,
	});

	// Apply global api prefix
	app.setGlobalPrefix(API_PREFIX);

	// Listen to requests
	await app.listen(process.env.APP_PORT || 3000, '0.0.0.0');
})();
