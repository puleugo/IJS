import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'ijs_user',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_DATABASE || 'ijs_test',
  entities: ['**/*.entity.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  dropSchema: true,
  logging: false,
  synchronize: true,
};

export default ormConfig;
