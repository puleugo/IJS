import { Injectable, } from '@nestjs/common';
import { CrawlerClient, } from '@infrastructure/types/crawler.client';

@Injectable()
export class UniversityProgramCrawlerClient implements CrawlerClient {
	async crawl(): Promise<any> {
		return;
	}

	async getStatus(): Promise<any> {
		return;
	}

	async initialize(): Promise<void> {
		return;
	}
}
