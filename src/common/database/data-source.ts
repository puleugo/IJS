import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions, } from 'typeorm';
import { SnakeNamingStrategy, } from 'typeorm-naming-strategies';

dotenv.config();

export const dataSourceConfig: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST || '',
	port: parseInt(process.env.DB_PORT) || 5432,
	database: process.env.DB_DATABASE || 'ijs_server',
	username: process.env.DB_USERNAME || 'ijs_user',
	password: process.env.DB_PASSWORD || 'secret',
	entities: ['dist/**/*.entity.js', 'dist/**/**/*.entity.js',],
	migrations: ['dist/migrations/**/*.js',],
	namingStrategy: new SnakeNamingStrategy(),
	logging: true,
	synchronize: true,
	migrationsRun: false,
};

export const dataSource = new DataSource(dataSourceConfig);
