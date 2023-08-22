import {
	BadRequestException, Injectable, OnApplicationBootstrap,
} from '@nestjs/common';
import { SchedulerRegistry, } from '@nestjs/schedule';
import { CronJob, } from 'cron';
import { InjectRepository, } from '@nestjs/typeorm';
import { Crawler, } from '@domain/crawler/crawler.entity';
import { Repository, } from 'typeorm';
import { UniversityBusScheduleCrawlerClient, } from '@app/crawler/university-bus-schedule-crawler/university-bus-schedule-crawler.client';
import { UniversityEventCrawlerClient, } from '@app/crawler/university-event-crawler/university-event-crawler.client';
import { UniversityProgramCrawlerClient, } from '@app/crawler/university-program-crawler/university-program-crawler.client';
import { UniversityMealCrawlerClient, } from '@app/crawler/university-meal-crawler/university-meal-crawler.client';
import { UniversityMajorNoticeCrawlerClient, } from '@app/crawler/university-major-notice-crawler/university-major-notice-crawler.client';
import { UniversityLectureCrawlerClient, } from '@app/crawler/university-lecture-crawler/university-lecture-crawler.client';
import { UniversityMajorCrawlerClient, } from '@app/crawler/university-major-crawler/university-major-crawler.client';
import { CrawlerEnum, } from '@app/crawler/utils/crawler.type';

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
        private readonly universityProgramCrawlerClient: UniversityProgramCrawlerClient
	) {
	}

	async onApplicationBootstrap(): Promise<void> {
		await this.initializeCrawlers();
		await this.runCrawlers();
	}

	async addCrawlerCron(crawler: Crawler): Promise<Crawler> {
		const isExist = this.schedulerRegistry.doesExist('cron', crawler.name);
		if (isExist) {
			return crawler;
		}
		const job = new CronJob(crawler.cronTime, () => {
			this.validateCrawlerName(crawler.name);
			this.executeCrawlerByName(crawler.name as CrawlerEnum);
		});

		this.schedulerRegistry.addCronJob(crawler.name, job);
		await this.crawlerRepository.update(crawler.id, { state: 'RUNNING', });
		job.start();

		return crawler;
	}

	async stopCronJob(crawler: Crawler): Promise<Crawler> {
		const isExist = this.schedulerRegistry.doesExist('cron', crawler.name);
		if (isExist) {
			this.schedulerRegistry.deleteCronJob(crawler.name);

			return crawler;
		}
		await this.crawlerRepository.update(crawler.id, { state: 'STOPPED', });

		return crawler;
	}

	async deleteCrawler(crawler: Crawler): Promise<void> {
		await this.crawlerRepository.delete({ name: crawler.name, });
	}

	async runCrawlers() : Promise<void> {
		const crawlers = await this.crawlerRepository.find({ where: { state: 'RUNNING', }, });
		await Promise.all(
			crawlers.map((crawler) => {
				const job = new CronJob(crawler.cronTime, () => {
					this.validateCrawlerName(crawler.name);
					this.executeCrawlerByName(crawler.name as CrawlerEnum);
				});

				this.schedulerRegistry.addCronJob(crawler.name, job);
				job.start();
			})
		);
	}

	private executeCrawlerByName(crawlerName: CrawlerEnum): Promise<void> {
		switch (crawlerName) {
			case CrawlerEnum.BUS_SCHEDULES:
				return this.universityBusScheduleCrawlerClient.crawl();
			case CrawlerEnum.EVENTS:
				return this.universityEventCrawlerClient.crawl();
			case CrawlerEnum.LECTURES:
				return this.universityLectureCrawlerClient.crawl();
			case CrawlerEnum.MAJORS:
				return this.universityMajorCrawlerClient.crawl();
			case CrawlerEnum.MAJOR_NOTICES:
				return this.universityMajorNoticeCrawlerClient.crawl();
			case CrawlerEnum.MEALS:
				return this.universityMealCrawlerClient.crawl();
			case CrawlerEnum.PROGRAMS:
				return this.universityProgramCrawlerClient.crawl();
			default:
				console.log('Crawler not found');

				return;
		}
	}

	private async initializeCrawlers(): Promise<void> {
		const crawlers = await this.crawlerRepository.find({ select: { name: true, }, });
		const crawlersName = crawlers.map(({ name, }) => {
			return name;
		});
		const doesNotExistCrawlersName = Object.values(CrawlerEnum).map(
			(name: string): string => {
				if (!crawlersName.includes(name)) return name;

				return;
			}
		);

		const createdCrawlers = await Promise.all(
			doesNotExistCrawlersName.reduce(
				(result: Crawler[], name: string) => {
					if (!name) return result;
					result.push(this.crawlerRepository.create({ name, }));

					return result;
				}, []
			)
		);

		await this.crawlerRepository.save(createdCrawlers);
	}

	private validateCrawlerName(name: string): Promise<void> {
		if (!Object.values(CrawlerEnum)?.includes(name as CrawlerEnum)) {
			throw new BadRequestException(`unvalidated crawler name: ${name}`);
		}

		return;
	}
}
