import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { AppModule } from '@app/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from './data-source';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as process from 'process';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6379,
        },
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    InfrastructureModule,
    AppModule,
    TypeOrmModule.forRoot(dataSourceConfig),
  ],
})
export class MainModule {}
