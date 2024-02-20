import { Global, Module, } from '@nestjs/common';
import { ConfigModule, } from '@nestjs/config';
import { LoggerService, } from '@common/utils/logger.service';
import { CrawlerUtilService, } from '@common/utils/crawler-util.service';

@Global()
@Module({
	imports: [ConfigModule,],
	providers: [LoggerService, CrawlerUtilService,],
	exports: [LoggerService, CrawlerUtilService,],
})
export class UtilModule {
}
