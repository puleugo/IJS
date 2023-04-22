import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { AppModule } from '@app/app.module';

@Module({
  imports: [InfrastructureModule, AppModule],
})
export class MainModule {}
