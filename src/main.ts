import {
	ClassSerializerInterceptor, INestApplication, ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector, } from '@nestjs/core';
import { SwaggerModule, } from '@nestjs/swagger';

import { MainModule, } from './main.module';

import generateSwaggerDocument from '@common/swagger/swagger.generator';
import { Constants, } from '@common/type/contants';

(async (): Promise<void> => {
	// Initialize app with root module
	const app: INestApplication =
    await NestFactory.create<NestFastifyApplication>(
    	MainModule, { logger: new LoggerService, }
    );

	// app 설정
	// 스웨거 문서화
	SwaggerModule.setup(`${Constants.API_PREFIX}/docs`, app, generateSwaggerDocument(app), { swaggerOptions: { persistAuthorization: true, }, });

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

	// URL에 API 경로 접두사 추가
	app.setGlobalPrefix(Constants.API_PREFIX);

	// Listen to requests
	await app.listen(process.env.APP_PORT || 3000, '0.0.0.0');
})();
