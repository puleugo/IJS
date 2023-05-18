import { Module } from '@nestjs/common';
import { UniversityModule } from '@app/university/university.module';
import { HealthCheckModule } from '@app/health/health-check.module';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from '@app/auth/auth.module';
import { DeliveryModule } from '@app/delivery/delivery.module';


@Module({
  imports: [
    UniversityModule,
    HealthCheckModule,
    UserModule,
    AuthModule,
    DeliveryModule,
  ],
})
export class AppModule {}
