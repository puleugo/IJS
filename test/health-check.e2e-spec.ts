import { Test, TestingModule, } from '@nestjs/testing';
import { INestApplication, } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule, } from '@app/app.module';
import { EventEmitterModule, } from '@nestjs/event-emitter';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { ConfigModule, } from '@nestjs/config';
import ormConfig from './test-orm-config';
import { ClientsModule, Transport, } from '@nestjs/microservices';

describe('헬스 체크 e2e', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ClientsModule.register([
					{
						name: 'MATH_SERVICE',
						transport: Transport.REDIS,
						options: {
							host: process.env.REDIS_HOST || 'localhost',
							port: Number(process.env.REDIS_PORT) || 6379,
							// password: process.env.REDIS_PASSWORD,
						},
					},
				]),
				ConfigModule.forRoot({
					isGlobal: true,
					cache: true,
				}),
				TypeOrmModule.forRoot(ormConfig),
				EventEmitterModule.forRoot(),
				AppModule,
				// InfrastructureModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it('헬스체크 동작 테스트', () => {
		return request(app.getHttpServer()).post('/health-check').expect(201);
	});

	it('레디스 동작 테스트', () => {
		return request(app.getHttpServer())
			.post('/health-check/redis')
			.expect(201);
	});
});
