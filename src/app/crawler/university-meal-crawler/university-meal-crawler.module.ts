import { Module } from '@nestjs/common';
import { UniversityMealCrawlerClient } from '@app/crawler/university-meal-crawler/university-meal-crawler.client';

@Module({
  providers: [UniversityMealCrawlerClient],
})
export class UniversityMealCrawlerModule {}
