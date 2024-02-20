import { Module, OnApplicationBootstrap, } from '@nestjs/common';

@Module({})
export class CronModule implements OnApplicationBootstrap {
	onApplicationBootstrap(): void {
		return;
	}
}
