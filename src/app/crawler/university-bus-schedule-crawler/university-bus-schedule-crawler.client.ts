import { Injectable, } from '@nestjs/common';
import { CrawlerClient, } from '@infrastructure/types/crawler.client';
import { Like, Repository, } from 'typeorm';
import { UniversityBusSchedule, } from '@domain/university/university-bus-schedule.entity';
import { InjectRepository, } from '@nestjs/typeorm';
import { getDateByTime, } from '@infrastructure/utils/get-date-by-time';
import { IUniversityBusSchedule, } from '@domain/university/university-bus-schedule.interface';
import { CrawlerUtilService, } from '@infrastructure/utils/crawler-util.service';
import { LoggerService, } from '@infrastructure/utils/logger.service';

@Injectable()
export class UniversityBusScheduleCrawlerClient implements CrawlerClient {
	constructor(
        @InjectRepository(UniversityBusSchedule)
        private readonly universityBusScheduleRepository: Repository<UniversityBusSchedule>,
        private readonly crawlerService: CrawlerUtilService,
		private readonly loggerService: LoggerService,
	) {
	}

	async crawl(): Promise<any> {
		await this.universityBusScheduleRepository.delete({});
		const url = 'https://www.inje.ac.kr/kor/campus-life/welfare-0102-1.asp';
		const browser = await this.crawlerService.launch();
		const page = await this.crawlerService.newFastPage(browser, url);
		try {
			// 학교→인제대역
			const SchoolToStation = await page.$eval(
				'#bus-schedule > div.l-box > div > table > tbody > tr > td:nth-child(1)', (elem) => {
					return elem.textContent;
				}
			);
			const SchoolToStations = SchoolToStation.replace(/\n/g, '')
				.replace(/\t/g, '')
				.replace(/\s\s/g, ' ')
				.split(/\s/);

			const schoolToStation: IUniversityBusSchedule[] = [];
			await Promise.all(
				SchoolToStations.map(async (time) => {
					const universityBusSchedule =
                        this.universityBusScheduleRepository.create({
                        	title: '인제대역',
                        	price: 0,
                        	departedOn: getDateByTime(time),
                        	fromSchool: true,
                        });
					schoolToStation.push(universityBusSchedule);
				})
			);
			await this.universityBusScheduleRepository.save(schoolToStation);

			// 인제대역→학교
			const stationToSchoolString = await page.$eval(
				'#bus-schedule > div.l-box > div > table > tbody > tr > td:nth-child(1)', (elem) => {
					return elem.textContent;
				}
			);
			const stationToSchools = stationToSchoolString
				.replace(/\n/g, '')
				.replace(/\t/g, '')
				.replace(/\s\s/g, ' ')
				.split(/\s/);

			const stationToSchool: IUniversityBusSchedule[] = [];
			await Promise.all(
				stationToSchools.map(async (time) => {
					const universityBusSchedule =
                        this.universityBusScheduleRepository.create({
                        	title: '인제대역',
                        	price: 0,
                        	departedOn: getDateByTime(time),
                        	toSchool: true,
                        });
					stationToSchool.push(universityBusSchedule);
				})
			);
			await this.universityBusScheduleRepository.save(stationToSchool);

			// get table row length
			const toSchoolTableRowLength = await page.$$eval(
				'#bus-schedule > div:nth-child(3) > table > tbody > tr', (elems) => {
					return elems.length;
				}
			);

			const toSchools: IUniversityBusSchedule[] = [];
			// 등교
			for (let i = 1; i <= toSchoolTableRowLength; i = i + 2) {
				const title = await page.$eval(
					`#bus-schedule > div:nth-child(3) > table > tbody > tr:nth-child(${i}) > th`, (elem) => {
						return elem.textContent;
					}
				);

				if (title.includes('인제대역')) continue;

				const times = await page.$eval(
					`#bus-schedule > div:nth-child(3) > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`, (elem) => {
						return elem.innerHTML
							.split('<br>')
							.map((em) => {
								return em.split('[')[0].trim();
							});
					}
				);

				const cost = await page.$eval(
					`#bus-schedule > div:nth-child(3) > table > tbody > tr:nth-child(${
						i + 1
					}) > td:nth-child(2)`, (elem) => {
						return elem.textContent
							.split('원')[0]
							.trim()
							.split('교통카드 ')[1]
							.trim()
							.replace(',', '');
					}
				);
				await Promise.all(
					times.map(async (time) => {
						const universityBusSchedule =
                            this.universityBusScheduleRepository.create({
                            	title,
                            	price: Number(cost),
                            	departedOn: getDateByTime(time),
                            	toSchool: true,
                            });
						toSchools.push(universityBusSchedule);
					})
				);
			}
			await this.universityBusScheduleRepository.save(toSchools);

			// 하교
			const fromSchoolTableRowLength = await page.$$eval(
				'#bus-schedule > div:nth-child(5) > table > tbody > tr', (elems) => {
					return elems.length;
				}
			);

			const fromSchools: IUniversityBusSchedule[] = [];
			for (let i = 1; i <= fromSchoolTableRowLength; i++) {
				const title = await page.$eval(
					`#bus-schedule > div:nth-child(5) > table > tbody > tr:nth-child(${i}) > th`, (elem) => {
						return elem.textContent;
					}
				);

				if (title.includes('인제대역')) continue;

				const times = await page.$eval(
					`#bus-schedule > div:nth-child(5) > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`, (elem) => {
						return elem.innerHTML
							.split('<br>')
							.map((em) => {
								return em.split('[')[0].trim();
							});
					}
				);

				await Promise.all(
					times.map(async (time) => {
						const universityBusSchedule =
                            this.universityBusScheduleRepository.create({
                            	title,
                            	departedOn: getDateByTime(time),
                            	fromSchool: true,
                            });
						fromSchools.push(universityBusSchedule);
					})
				);
			}

			await Promise.all(
				fromSchools.map(async (fromSchool) => {
					const universityBus =
                        await this.universityBusScheduleRepository.findOne({ where: { title: Like(`%${fromSchool.title}%`), }, });
					fromSchool.price = universityBus.price;
				})
			);
			await this.universityBusScheduleRepository.save(fromSchools);
		} catch (e) {
			this.loggerService.error('UniversityBusScheduleCrawlerClient error', e);
		}
		await browser.close();

		return;
	}

	async getStatus(): Promise<any> {
		return;
	}

	async initialize(): Promise<void> {
		return;
	}
}
