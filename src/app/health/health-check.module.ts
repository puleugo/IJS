import { Module, } from '@nestjs/common';
import { HealthCheckController, } from '@app/health/health-check.controller';

@Module({
	imports: [],
	controllers: [HealthCheckController,],
})
export class HealthCheckModule {
}
