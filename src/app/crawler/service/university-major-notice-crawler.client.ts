import { Injectable, } from '@nestjs/common';
import { CrawlerClient, } from '@common/type/crawler.client';

@Injectable()
export class UniversityMajorNoticeCrawlerClient implements CrawlerClient {

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
