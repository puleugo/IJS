import { Module } from '@nestjs/common';
import { AdminModule } from '@infrastructure/admin/admin.module';

@Module({
  imports: [AdminModule],
})
export class InfrastructureModule {}
