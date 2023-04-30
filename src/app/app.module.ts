import { Module } from '@nestjs/common';
import { UniversityModule } from '@app/university/university.module';
import { HealthCheckModule } from '@app/health/health-check.module';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [UniversityModule, HealthCheckModule, UserModule, AuthModule],
})
export class AppModule {}
