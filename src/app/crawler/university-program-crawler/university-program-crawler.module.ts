import { Module, } from '@nestjs/common';
import { UniversityProgramCrawlerClient, } from '@app/crawler/university-program-crawler/university-program-crawler.client';

@Module({
	providers: [UniversityProgramCrawlerClient,],
	exports: [UniversityProgramCrawlerClient,],
})
export class UniversityProgramCrawlerModule {}
