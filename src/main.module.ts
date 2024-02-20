import { Module, } from '@nestjs/common';
import { CommonModule, } from '@common/common.module';
import { AppModule, } from '@app/app.module';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { ConfigModule, } from '@nestjs/config';
import { ClientsModule, Transport, } from '@nestjs/microservices';
import * as process from 'process';
import { dataSourceConfig, } from '@common/database/data-source';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'MATH_SERVICE',
				transport: Transport.REDIS,
				options: {
					host: process.env.REDIS_HOST || 'localhost',
					port: Number(process.env.REDIS_PORT) || 6379,
					password: process.env.REDIS_PASSWORD,
				},
			},
		]),
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
		}),
		CommonModule,
		AppModule,
		TypeOrmModule.forRoot(dataSourceConfig),
	],
})
export class MainModule {
}
