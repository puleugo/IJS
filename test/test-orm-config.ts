import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: 'ijs_user',
  password: 'secret',
  database: 'ijs_test',
  entities: ['**/*.entity.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  dropSchema: true,
  logging: ['error'],
  synchronize: true,
};

export default ormConfig;
