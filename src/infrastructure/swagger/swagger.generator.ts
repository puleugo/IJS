import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { tags } from '@infrastructure/swagger/swagger.tags';
import { API_PREFIX } from '../../contants';
import { INestApplication } from '@nestjs/common';

const document = new DocumentBuilder()
  .setTitle(`인제생 ${API_PREFIX} API`)
  .setDescription(`인제생 ${API_PREFIX} API 문서`)
  .setContact('인제생 개발팀', 'https://uoslife.team', 'puleugo@gmail.com')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
  .addServer(
    (process.env.APP_URL || 'http://localhost:3000') + '/' + API_PREFIX,
  )
  .addServer(`https://localhost:3000/${API_PREFIX}`)
  .setVersion('0.0.1');

tags.forEach((tag) => document.addTag(tag.name, tag.description));

export default function generateSwaggerDocument(app: INestApplication) {
  return SwaggerModule.createDocument(app, document.build());
}
