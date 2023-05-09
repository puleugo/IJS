import { Module } from '@nestjs/common';
import { HealthCheckController } from '@app/health/health-check.controller';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          url: 'redis://localhost:6379',
        },
      }),
    }),
  ],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
