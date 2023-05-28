import { Injectable } from '@nestjs/common';
import { CrawlerClient } from '@infrastructure/utils/crawler.client';
import { Repository } from 'typeorm';
import { UniversityMeal } from '@domain/university/university-meal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
import { MealCourseEnum } from '@domain/university/university-meal.interface';
import { getLastMondayByDate } from '@infrastructure/utils/get-last-monday-by-date';
import { Crawler } from '@domain/crawler/crawler.entity';

@Injectable()
export class UniversityMealCrawlerClient implements CrawlerClient {
  constructor(
    @InjectRepository(UniversityMeal)
    private readonly universityMealRepository: Repository<UniversityMeal>,
    @InjectRepository(Crawler)
    private readonly crawlerRepository: Repository<Crawler>,
  ) {}

  async crawl(): Promise<any> {
    const url =
      'https://www.inje.ac.kr/kor/Template/Bsub_page.asp?Ltype=5&Ltype2=3&Ltype3=3&Tname=S_Food&Ldir=board/S_Food&Lpage=s_food_view&d1n=5&d2n=4&d3n=4&d4n=0';
    const browser = await puppeteer.launch({
      headless: 'new',
      waitForInitialPage: true,
    });

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (
        req.resourceType() === 'image' ||
        req.resourceType() === 'font' ||
        req.resourceType() === 'stylesheet' ||
        req.resourceType() === 'script' ||
        req.resourceType() === 'stylesheet' ||
        req.resourceType() === 'media'
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
    await page.goto(url, { waitUntil: 'networkidle2' });

    const weekDay = getLastMondayByDate(new Date());

    const meals: UniversityMeal[] = [];
    for (let i = 3; i < 8; i++) {
      const elem1 = await page.$(
        `#table1 > tbody > tr:nth-child(1) > td:nth-child(${i})`,
      );

      const courseA = await page.evaluate((elem) => elem.textContent, elem1);
      meals.push(
        await this.universityMealRepository.create({
          menu: courseA.split(','),
          course: MealCourseEnum.A,
          publishedAt: new Date(weekDay.valueOf()),
        }),
      );

      const elem2 = await page.$(
        `#table1 > tbody > tr:nth-child(2) > td:nth-child(${i})`,
      );
      const courseB = await page.evaluate((elem) => elem.textContent, elem2);

      meals.push(
        await this.universityMealRepository.create({
          menu: courseB.split(','),
          course: MealCourseEnum.B,
          publishedAt: new Date(weekDay.valueOf()),
        }),
      );

      const elem3 = await page.$(
        `#table1 > tbody > tr:nth-child(3) > td:nth-child(${i})`,
      );
      const courseC = await page.evaluate((elem) => elem.textContent, elem3);
      meals.push(
        await this.universityMealRepository.create({
          menu: courseC.split(','),
          course: MealCourseEnum.C,
          publishedAt: new Date(weekDay.valueOf()),
        }),
      );
      weekDay.setDate(weekDay.getDate() + 1);
    }
    await this.universityMealRepository.save(meals);
    await browser.close();
    return;
  }

  async getStatus(): Promise<any> {
    return;
  }

  async initialize(
    name: 'university-meal-crawler',
    cronTime: string,
  ): Promise<void> {
    const crawler = await this.crawlerRepository.findOne({ where: { name } });
    if (!crawler) {
      await this.crawlerRepository.save({
        name,
        cronTime,
      });
      return;
    }
    await this.crawlerRepository.update({ id: crawler.id }, { cronTime });
  }
}
