import { Injectable } from '@nestjs/common';
import { CrawlerClient } from '@infrastructure/utils/crawler.client';
import { Repository } from 'typeorm';
import { UniversityMeal } from '@domain/university/university-meal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
import { MealCourseEnum } from '@domain/university/university-meal.interface';
import { getLastMondayByDate } from '@infrastructure/utils/get-last-monday-by-date';
import { Crawler } from '@domain/crawler/crawler.entity';
import { getPuppeteerPage } from '@infrastructure/utils/get-puppeteer-page';

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
    const browser: puppeteer.Browser = await puppeteer.launch({
      headless: 'new',
      waitForInitialPage: true,
    });
    const page = await getPuppeteerPage(browser, url);
    try {
      const weekDay = getLastMondayByDate(new Date());

      const meals: UniversityMeal[] = [];
      for (let i = 3; i < 8; i++) {
        const courseA = await page.$eval(
          `#table1 > tbody > tr:nth-child(1) > td:nth-child(${i})`,
          (elem) =>
            elem.innerHTML
              .replace(/&nbsp;/g, '')
              .replace(/&amp;/g, '&')
              .replace(/\((.*?)\)<br>/g, '')
              .split('<br>'),
        );
        meals.push(
          await this.universityMealRepository.create({
            menu: courseA,
            course: MealCourseEnum.A,
            publishedAt: new Date(weekDay.valueOf()),
          }),
        );

        const courseB = await page.$eval(
          `#table1 > tbody > tr:nth-child(2) > td:nth-child(${i})`,
          (elem) =>
            elem.innerHTML
              .replace(/&nbsp;/g, '')
              .replace(/&amp;/g, '&')
              .replace(/\((.*?)\)<br>/g, '')
              .split('<br>'),
        );

        meals.push(
          await this.universityMealRepository.create({
            menu: courseB,
            course: MealCourseEnum.B,
            publishedAt: new Date(weekDay.valueOf()),
          }),
        );

        const courseC = await page.$eval(
          `#table1 > tbody > tr:nth-child(3) > td:nth-child(${i})`,
          (elem) =>
            elem.innerHTML
              .replace(/&nbsp;/g, '')
              .replace(/&amp;/g, '&')
              .replace(/\((.*?)\)<br>/g, '')
              .split('<br>'),
        );
        meals.push(
          await this.universityMealRepository.create({
            menu: courseC,
            course: MealCourseEnum.C,
            publishedAt: new Date(weekDay.valueOf()),
          }),
        );
        weekDay.setDate(weekDay.getDate() + 1);
      }
      await this.universityMealRepository.save(meals);
    } catch (e) {
      console.log(e);
    }
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
