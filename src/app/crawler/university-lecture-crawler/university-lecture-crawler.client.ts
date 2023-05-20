import { Injectable } from '@nestjs/common';
import { CrawlerClient } from '@infrastructure/utils/crawler.client';

@Injectable()
export class UniversityLectureCrawlerClient implements CrawlerClient {
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
