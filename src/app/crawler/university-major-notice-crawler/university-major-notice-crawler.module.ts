import { Module, } from '@nestjs/common';
import { UniversityMajorNoticeCrawlerClient, } from '@app/crawler/university-major-notice-crawler/university-major-notice-crawler.client';
import { UtilModule, } from '@infrastructure/utils/util.module';

@Module({
	imports: [UtilModule,],
	providers: [UniversityMajorNoticeCrawlerClient,],
	exports: [UniversityMajorNoticeCrawlerClient,],
})
export class UniversityMajorNoticeCrawlerModule {
}
