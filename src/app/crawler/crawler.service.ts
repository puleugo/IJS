import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { InjectRepository } from '@nestjs/typeorm';
import { Crawler } from '@domain/crawler/crawler.entity';
import { Repository } from 'typeorm';
import { UniversityBusScheduleCrawlerClient } from '@app/crawler/university-bus-schedule-crawler/university-bus-schedule-crawler.client';
import { UniversityEventCrawlerClient } from '@app/crawler/university-event-crawler/university-event-crawler.client';
import { UniversityProgramCrawlerClient } from '@app/crawler/university-program-crawler/university-program-crawler.client';
import { UniversityMealCrawlerClient } from '@app/crawler/university-meal-crawler/university-meal-crawler.client';
import { UniversityMajorNoticeCrawlerClient } from '@app/crawler/university-major-notice-crawler/university-major-notice-crawler.client';
import { UniversityLectureCrawlerClient } from '@app/crawler/university-lecture-crawler/university-lecture-crawler.client';
import { UniversityMajorCrawlerClient } from '@app/crawler/university-major-crawler/university-major-crawler.client';

@Injectable()
export class CrawlerService implements OnApplicationBootstrap {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    @InjectRepository(Crawler)
    private readonly crawlerRepository: Repository<Crawler>,
    private readonly universityBusScheduleCrawlerClient: UniversityBusScheduleCrawlerClient,
    private readonly universityEventCrawlerClient: UniversityEventCrawlerClient,
    private readonly universityLectureCrawlerClient: UniversityLectureCrawlerClient,
    private readonly universityMajorCrawlerClient: UniversityMajorCrawlerClient,
    private readonly universityMajorNoticeCrawlerClient: UniversityMajorNoticeCrawlerClient,
    private readonly universityMealCrawlerClient: UniversityMealCrawlerClient,
    private readonly universityProgramCrawlerClient: UniversityProgramCrawlerClient,
  ) {}

  async onApplicationBootstrap() {
    await this.runCrawlers();
  }

  async addCrawlerCron(crawler: Crawler): Promise<Crawler> {
    const isExist = this.schedulerRegistry.doesExist('cron', crawler.name);
    if (isExist) {
      return crawler;
    }
    const job = new CronJob(crawler.cronTime, () => {
      this.executeCrawlerByName(crawler.name);
    });

    await this.schedulerRegistry.addCronJob(crawler.name, job);
    await this.crawlerRepository.update(crawler.id, {
      state: 'RUNNING',
    });
    await job.start();
    return crawler;
  }

  async stopCronJob(crawler: Crawler): Promise<Crawler> {
    const isExist = this.schedulerRegistry.doesExist('cron', crawler.name);
    if (isExist) {
      await this.schedulerRegistry.deleteCronJob(crawler.name);
      return crawler;
    }
    await this.crawlerRepository.update(crawler.id, {
      state: 'STOPPED',
    });
    return crawler;
  }

  async deleteCrawler(crawler: Crawler): Promise<void> {
    await this.crawlerRepository.delete({ name: crawler.name });
  }

  async runCrawlers() {
    const crawlers = await this.crawlerRepository.find({
      where: {
        state: 'RUNNING',
      },
    });
    await Promise.all(
      crawlers.map((crawler) => {
        const job = new CronJob(crawler.cronTime, () => {
          this.executeCrawlerByName(crawler.name);
        });

        this.schedulerRegistry.addCronJob(crawler.name, job);
        job.start();
      }),
    );
  }

  private executeCrawlerByName(crawlerName: string): Promise<void> {
    switch (crawlerName) {
      case 'university-bus-schedule-crawler':
        return this.universityBusScheduleCrawlerClient.crawl();
      case 'university-event-crawler':
        return this.universityEventCrawlerClient.crawl();
      case 'university-lecture-crawler':
        return this.universityLectureCrawlerClient.crawl();
      case 'university-major-crawler':
        return this.universityMajorCrawlerClient.crawl();
      case 'university-major-notice-crawler':
        return this.universityMajorNoticeCrawlerClient.crawl();
      case 'university-meal-crawler':
        return this.universityMealCrawlerClient.crawl();
      case 'university-program-crawler':
        return this.universityProgramCrawlerClient.crawl();
      default:
        console.log('Crawler not found');
        return;
    }
  }
}
