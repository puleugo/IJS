import { Module } from '@nestjs/common';
import { HealthCheckController } from '@app/health/health-check.controller';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          url: `redis://${configService.get<string>(
            'REDIS_HOST',
            'localhost',
          )}:${configService.get<string>('REDIS_PORT', '6379')}`,
          password: configService.get<string>('REDIS_PASSWORD', ''),
        },
      }),
    }),
  ],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
