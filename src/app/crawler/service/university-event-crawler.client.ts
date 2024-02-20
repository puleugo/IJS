import { Injectable, } from '@nestjs/common';
import { CrawlerClient, } from '@common/type/crawler.client';
import {
	Between, LessThan, Like, MoreThan, Repository,
} from 'typeorm';
import { UniversityEvent, } from '@app/university/domain/university-event.entity';
import { InjectRepository, } from '@nestjs/typeorm';
import { removeEscapeCharacters, } from '@common/utils/remove-escape-characters';
import { UniversitySemester, } from '@app/university/domain/university-semester.entity';
import { Crawler, } from '@app/crawler/domain/crawler.entity';
import { CrawlerUtilService, } from '@common/utils/crawler-util.service';
import { LoggerService, } from '@common/utils/logger.service';

@Injectable()
export class UniversityEventCrawlerClient implements CrawlerClient {
	constructor(
        @InjectRepository(UniversityEvent)
        private readonly universityEventRepository: Repository<UniversityEvent>,
        @InjectRepository(UniversitySemester)
        private readonly universitySemesterRepository: Repository<UniversitySemester>,
        @InjectRepository(Crawler)
        private readonly crawlerRepository: Repository<Crawler>,
        private readonly crawlerUtilService: CrawlerUtilService,
		private readonly loggerService: LoggerService
	) {}

	async crawl(): Promise<void> {
		const url =
            'https://www.inje.ac.kr/kor/Template/Bsub_page.asp?Ltype=4&Ltype2=1&Ltype3=0&Tname=S_Schedule&Ldir=board/S_Schedule&Lpage=Tboard_L&d1n=4&d2n=2&d3n=1&d4n=1';
		const browser = await this.crawlerUtilService.launch();
		const page = await this.crawlerUtilService.newFastPage(browser, url);

		try {
			let currentYear = new Date().getFullYear();

			for (let pageIdx = 1; pageIdx <= 12; pageIdx++) {
				const monthData = await page.$(
					`#contents > div.b-calendar > div:nth-child(${pageIdx}) > div.detail`
				);
				const courseA = await page.evaluate(
					(elem) => {
						return elem.textContent;
					}, monthData
				);
				if (pageIdx === 11) currentYear += 1;

				const removedText = removeEscapeCharacters(courseA, '\t')
					.split('\n')
					.filter((line) => {
						return line.trim() !== '';
					});

				for (let i = 0; i < removedText.length; i += 2) {
					const key = removedText[i];
					const value = removedText[i + 1];
					const [startAt, endAt,] = await this.getDatesByEventKey(
						key, currentYear
					);
					await this.universityEventRepository.save({
						title: value,
						startAt,
						endAt,
					});
				}
			}

			const searchYear = new Date().getFullYear();
			const semesters = await Promise.all([
				this.getSemesterByUniversityEvents(searchYear, 1), this.getSemesterByUniversityEvents(searchYear, 2),
			]);
			await this.universitySemesterRepository.save(semesters);
		} catch (e) {
			this.loggerService.error(e);
		}
		await browser.close();

		return;
	}

	async getStatus(): Promise<any> {
		return;
	}

	async initialize(
		name: 'university-event-crawler',
		cronTime: string
	): Promise<void> {
		const crawler = await this.crawlerRepository.findOne({ where: { name, }, });
		if (!crawler) {
			await this.crawlerRepository.save({
				name,
				cronTime,
			});

			return;
		}
		await this.crawlerRepository.update({ id: crawler.id, }, { cronTime, });
	}

	private async getDatesByEventKey(
		key: string,
		currentYear: number
	): Promise<[startAt: Date, endAt: Date]> {
		const dateValue = key.replace(/\([^)]+\)/g, '');

		if (!dateValue.includes('~')) {
			const date = await this.getDatesByEventDate(dateValue, currentYear);

			return [date, date,];
		}

		const [startDate, endDate,] = dateValue.split('~');
		const [startAt, endAt,] = await Promise.all([
			this.getDatesByEventDate(startDate, currentYear), this.getDatesByEventDate(endDate, currentYear),
		]);

		return [startAt, endAt,];
	}

	private async getDatesByEventDate(
		date: string,
		currentYear: number
	): Promise<Date> {
		const [month, day,] = date.split('/').map(Number);

		return new Date(currentYear, month - 1, day);
	}

	private async getSemesterByUniversityEvents(
		searchYear: number,
		semesterNumber: number
	): Promise<UniversitySemester> {
		const { startAt: startedAt, } =
            await this.universityEventRepository.findOne({
            	where: {
            		title: Like(`%${semesterNumber}학기 학기개시일`),
            		startAt: MoreThan(new Date(searchYear, 0, 1)),
            	},
            });
		let vacation: string;
		if (semesterNumber === 1) {
			vacation = '하계방학';
		} else if (semesterNumber === 2) {
			vacation = '동계방학';
		}
		const { endAt: endedAt, } = await this.universityEventRepository.findOne(
			{
				where: {
					title: Like(`${vacation} 시작일`),
					endAt: LessThan(new Date(searchYear, 11, 30)),
				},
			}
		);

		const { startAt: middleExamAt, } =
            await this.universityEventRepository.findOne({
            	where: {
            		title: Like('%중간고사 기간'),
            		startAt: Between(startedAt, endedAt),
            	},
            });

		const { startAt: finalExamAt, } =
            await this.universityEventRepository.findOne({
            	where: {
            		title: Like('%기말고사 기간'),
            		startAt: Between(startedAt, endedAt),
            	},
            });
		const year = new Date(startedAt).getFullYear();

		return this.universitySemesterRepository.create({
			name: year.toString() + `-${semesterNumber}학기`,
			year,
			startedAt,
			endedAt,
			semesterNumber,
			middleExamAt,
			finalExamAt,
		});
	}
}
