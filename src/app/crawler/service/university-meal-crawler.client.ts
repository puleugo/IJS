import { Injectable, } from '@nestjs/common';
import { CrawlerClient, } from '@common/type/crawler.client';
import { Repository, } from 'typeorm';
import { UniversityMeal, } from '@app/university/domain/university-meal.entity';
import { InjectRepository, } from '@nestjs/typeorm';
import { getLastMondayByDate, } from '@common/utils/get-last-monday-by-date';
import { Crawler, } from '@app/crawler/domain/crawler.entity';
import { CrawlerUtilService, } from '@common/utils/crawler-util.service';
import { LoggerService, } from '@common/utils/logger.service';
import { MealCourseEnum, } from '@app/crawler/domain/meal-course.enum';

@Injectable()
export class UniversityMealCrawlerClient implements CrawlerClient {
	constructor(
        @InjectRepository(UniversityMeal)
        private readonly universityMealRepository: Repository<UniversityMeal>,
        @InjectRepository(Crawler)
        private readonly crawlerRepository: Repository<Crawler>,
        private readonly crawlerUtilService: CrawlerUtilService,
        private readonly loggerService: LoggerService
	) {}

	async crawl(): Promise<any> {
		const url =
            'https://www.inje.ac.kr/kor/Template/Bsub_page.asp?Ltype=5&Ltype2=3&Ltype3=3&Tname=S_Food&Ldir=board/S_Food&Lpage=s_food_view&d1n=5&d2n=4&d3n=4&d4n=0';
		const meals: UniversityMeal[] = [];
		const browser = await this.crawlerUtilService.launch();
		const page = await this.crawlerUtilService.newFastPage(browser, url);
		try {
			const weekDay = getLastMondayByDate(new Date());

			for (let i = 3; i < 8; i++) {
				const courseA = await page.$eval(
					`#table1 > tbody > tr:nth-child(1) > td:nth-child(${i})`, (elem) => {
						return elem.innerHTML
							.replace(/&nbsp;/g, '')
							.replace(/&amp;/g, '&')
							.replace(/&amp;/g, '&')
							.replace(/\((.*?)\)<br>/g, '')
							.replace(/&lt;/g, '<')
							.replace(/&gt;/g, '>')
							.split('<br>');
					}
				);
				const mealA = this.universityMealRepository.create({
					menu: courseA,
					course: MealCourseEnum.A,
					publishedAt: new Date(weekDay.valueOf()),
				});
				meals.push(mealA);

				const courseB = await page.$eval(
					`#table1 > tbody > tr:nth-child(2) > td:nth-child(${i})`, (elem) => {
						return elem.innerHTML
							.replace(/&nbsp;/g, '')
							.replace(/&amp;/g, '&')
							.replace(/\((.*?)\)<br>/g, '')
							.split('<br>');
					}
				);

				const mealB = this.universityMealRepository.create({
					menu: courseB,
					course: MealCourseEnum.B,
					publishedAt: new Date(weekDay.valueOf()),
				});
				meals.push(mealB);

				const courseC = await page.$eval(
					`#table1 > tbody > tr:nth-child(3) > td:nth-child(${i})`, (elem) => {
						return elem.innerHTML
							.replace(/&nbsp;/g, '')
							.replace(/&amp;/g, '&')
							.replace(/\((.*?)\)<br>/g, '')
							.split('<br>');
					}
				);
				const mealC = this.universityMealRepository.create({
					menu: courseC,
					course: MealCourseEnum.C,
					publishedAt: new Date(weekDay.valueOf()),
				});
				meals.push(mealC);
				weekDay.setDate(weekDay.getDate() + 1);
			}
			await Promise.all(
				meals.map(async (meal) => {
					this.universityMealRepository.create(meal);
				})
			);
			await this.universityMealRepository.save(meals);
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
		name: 'university-meal-crawler',
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
}
