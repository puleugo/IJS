import { Module } from '@nestjs/common';
import { UniversityMealCrawlerClient } from '@app/crawler/university-meal-crawler/university-meal-crawler.client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityMeal } from '@domain/university/university-meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UniversityMeal])],
  providers: [UniversityMealCrawlerClient],
})
export class UniversityMealCrawlerModule {}
