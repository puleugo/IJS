export type CrawlerClient = {
  crawl(): Promise<void>;
  getStatus(): Promise<CrawlerClientStatus>;
};

export type CrawlerClientStatus = {
  status: CrawlerClientStatusEnum;
  lastCrawlDate: Date | null;
};

export enum CrawlerClientStatusEnum {
  running = 'running',
  stopped = 'stopped',
  error = 'error',
}
