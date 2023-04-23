import { Module } from '@nestjs/common';
import { UniversityModule } from '@app/university/university.module';
import { HealthCheckModule } from '@app/health/health-check.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UniversityModule, HealthCheckModule, UserModule],
})
export class AppModule {}
