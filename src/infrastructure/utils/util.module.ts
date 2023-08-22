import { Module, } from '@nestjs/common';
import { ConfigModule, } from '@nestjs/config';
import { LoggerService, } from '@infrastructure/utils/logger.service';
import { CrawlerUtilService, } from '@infrastructure/utils/crawler-util.service';

@Module({
	imports: [ConfigModule,],
	providers: [LoggerService, CrawlerUtilService,],
	exports: [LoggerService, CrawlerUtilService,],
})
export class UtilModule {
}
