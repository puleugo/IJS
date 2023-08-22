import { Module, } from '@nestjs/common';
import { UniversityProgramCrawlerClient, } from '@app/crawler/university-program-crawler/university-program-crawler.client';
import { UtilModule, } from '@infrastructure/utils/util.module';

@Module({
	imports: [UtilModule,],
	providers: [UniversityProgramCrawlerClient,],
	exports: [UniversityProgramCrawlerClient,],
})
export class UniversityProgramCrawlerModule {}
