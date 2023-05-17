import { Injectable } from '@nestjs/common';
import { CrawlerClient } from '@infrastructure/utils/crawlerClient';

@Injectable()
export class UniversityProgramCrawlerClient implements CrawlerClient {
  constructor() {}

  async crawl(): Promise<any> {
    return;
  }

  async getStatus(): Promise<any> {
    return;
  }
}
