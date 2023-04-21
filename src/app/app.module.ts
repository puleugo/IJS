import { Module } from '@nestjs/common';
import { UniversityModule } from '@app/university/university.module';
import { HealthCheckModule } from '@app/health/health-check.module';

@Module({
  imports: [UniversityModule, HealthCheckModule],
})
export class AppModule {}
