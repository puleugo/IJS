import { Injectable, } from '@nestjs/common';
import { CrawlerClient, } from '@common/type/crawler.client';
import { Repository, } from 'typeorm';
import { UniversityMajor, } from '@app/university/domain/university-major.entity';
import { InjectRepository, } from '@nestjs/typeorm';
import { UniversityDepartment, } from '@app/university/domain/university-department.entity';
import { Crawler, } from '@app/crawler/domain/crawler.entity';
import { CrawlerUtilService, } from '@common/utils/crawler-util.service';
import { LoggerService, } from '@common/utils/logger.service';

@Injectable()
export class UniversityMajorCrawlerClient implements CrawlerClient {
	constructor(
        @InjectRepository(UniversityMajor)
        private readonly universityMajorRepository: Repository<UniversityMajor>,
        @InjectRepository(UniversityDepartment)
        private readonly universityDepartmentRepository: Repository<UniversityDepartment>,
        @InjectRepository(Crawler)
        private readonly crawlerRepository: Repository<Crawler>,
        private readonly crawlerUtilService: CrawlerUtilService,
		private readonly loggerService: LoggerService
	) {}

	async crawl(): Promise<any> {
		const url = 'https://www.inje.ac.kr/kor/academics/academics.asp';
		const browser = await this.crawlerUtilService.launch();
		const page = await this.crawlerUtilService.newFastPage(browser, url);
		try {
			const departments: {
                name: string;
                url: string;
                departmentName: string;
                departmentUrl: string | null;
            }[][] = await page.$$eval(
            	'#organization > div > div', (departments) => {
            		return departments.map((department) => {
            			const departmentName =
                            department.querySelector('h3').textContent;
            			const departmentUrl =
                            department.querySelector('a').href;
            			const majors = Array.from(
            				department.querySelectorAll('li')
            			);

            			return majors.map((major) => {
            				const name = major.textContent;
            				const url = major.querySelector('a').href;

            				return {
            					name,
            					url,
            					departmentName,
            					departmentUrl,
            				};
            			});
            		});
            	}
            );

			departments.map(async (departmentData) => {
				let department: UniversityDepartment;
				department = await this.universityDepartmentRepository.findOne({ where: { name: departmentData[0].departmentName, }, });
				if (!department) {
					department = await this.universityDepartmentRepository.save(
						{
							name: departmentData[0].departmentName,
							url: departmentData[0].departmentUrl
								? departmentData[0].departmentUrl
								: null,
						}
					);
				}
				await Promise.all(
					departmentData.map(async (s): Promise<UniversityMajor> => {
						return await this.universityMajorRepository.save({
							name: s.name,
							url: s.url,
							department,
						});
					})
				);
			});
		} catch (e) {
			this.loggerService.verbose('UniversityMajorCrawlerClient error');
		}

		await browser.close();

		return;
	}

	async getStatus(): Promise<any> {
		return;
	}

	async initialize(
		name: 'university-major-crawler',
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
