import {
	DocumentBuilder, OpenAPIObject, SwaggerModule,
} from '@nestjs/swagger';
import { tags, } from './swagger.tags';
import { Constants, } from '@common/type/contants';
import { INestApplication, } from '@nestjs/common';

const document = new DocumentBuilder()
	.setTitle(`인제생 ${Constants.API_PREFIX} API`)
	.setDescription(`인제생 ${Constants.API_PREFIX} API 문서`)
	.setContact('인제생 개발팀', 'https://localhost:3000', 'puleugo@gmail.com')
	.addBearerAuth({
		type: 'http',
		scheme: 'bearer',
		bearerFormat: 'JWT',
	})
	.addServer(
		(process.env.APP_URL || 'http://localhost:3000') + '/' + Constants.API_PREFIX
	)
	.addServer(`https://localhost:3000/${Constants.API_PREFIX}`)
	.setVersion('0.0.1');

tags.forEach((tag) => {
	return document.addTag(tag.name, tag.description);
});

export default function generateSwaggerDocument(app: INestApplication): OpenAPIObject {
	return SwaggerModule.createDocument(app, document.build());
}