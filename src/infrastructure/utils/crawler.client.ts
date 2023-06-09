export abstract class CrawlerClient {
  abstract crawl(): Promise<void>;

  abstract getStatus(): Promise<CrawlerClientStatus>;

  abstract initialize(name: string, cronTime: string): Promise<void>;
}

export type CrawlerClientStatus = {
  status: CrawlerClientStatusEnum;
  lastCrawlDate: Date | null;
};

export enum CrawlerClientStatusEnum {
  running = 'running',
  stopped = 'stopped',
  error = 'error',
}
