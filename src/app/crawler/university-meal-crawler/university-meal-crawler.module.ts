import { Module, } from '@nestjs/common';
import { UniversityMealCrawlerClient, } from '@app/crawler/university-meal-crawler/university-meal-crawler.client';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { UniversityMeal, } from '@domain/university/university-meal.entity';
import { Crawler, } from '@domain/crawler/crawler.entity';
import { UtilModule, } from '@infrastructure/utils/util.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UniversityMeal, Crawler,
		]),
		UtilModule,
	],
	providers: [UniversityMealCrawlerClient,],
	exports: [UniversityMealCrawlerClient,],
})
export class UniversityMealCrawlerModule {
}
