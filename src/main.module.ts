import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { AppModule } from '@app/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from './data-source';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    InfrastructureModule,
    AppModule,
    TypeOrmModule.forRoot(dataSourceConfig),
  ],
})
export class MainModule {}
