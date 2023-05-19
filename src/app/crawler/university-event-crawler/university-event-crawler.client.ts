import { Injectable } from '@nestjs/common';
import { CrawlerClient } from '@infrastructure/utils/crawler.client';
import { Repository } from 'typeorm';
import { UniversityEvent } from '@domain/university/university-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
import { removeEscapeCharacters } from '@infrastructure/utils/remove-escape-characters';

@Injectable()
export class UniversityEventCrawlerClient implements CrawlerClient {
  constructor(
    @InjectRepository(UniversityEvent)
    private readonly universityEventRepository: Repository<UniversityEvent>,
  ) {}

  async crawl(): Promise<void> {
    const url =
      'https://www.inje.ac.kr/kor/Template/Bsub_page.asp?Ltype=4&Ltype2=1&Ltype3=0&Tname=S_Schedule&Ldir=board/S_Schedule&Lpage=Tboard_L&d1n=4&d2n=2&d3n=1&d4n=1';
    const browser = await puppeteer.launch({
      headless: true,
      waitForInitialPage: true,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    let currentYear = new Date().getFullYear();

    for (let pageIdx = 1; pageIdx <= 12; pageIdx++) {
      const monthData = await page.$(
        `#contents > div.b-calendar > div:nth-child(${pageIdx}) > div.detail`,
      );
      const courseA = await page.evaluate(
        (elem) => elem.textContent,
        monthData,
      );
      if (pageIdx === 11) currentYear += 1;

      const removedText = removeEscapeCharacters(courseA, '\t')
        .split('\n')
        .filter((line) => line.trim() !== '');

      for (let i = 0; i < removedText.length; i += 2) {
        const key = removedText[i];
        const value = removedText[i + 1];
        const [startAt, endAt] = await this.getDatesByEventKey(
          key,
          currentYear,
        );
        await this.universityEventRepository.save({
          title: value,
          startAt,
          endAt,
        });
      }
    }
    await browser.close();
    return;
  }

  async getStatus(): Promise<any> {
    return;
  }

  async getDatesByEventKey(
    key: string,
    currentYear: number,
  ): Promise<[startAt: Date, endAt: Date]> {
    const dateValue = key.replace(/\([^)]+\)/g, '');

    if (!dateValue.includes('~')) {
      const date = await this.getDatesByEventDate(dateValue, currentYear);
      return [date, date];
    }

    const [startDate, endDate] = dateValue.split('~');
    const [startAt, endAt] = await Promise.all([
      this.getDatesByEventDate(startDate, currentYear),
      this.getDatesByEventDate(endDate, currentYear),
    ]);
    return [startAt, endAt];
  }

  async getDatesByEventDate(date: string, currentYear: number): Promise<Date> {
    const [month, day] = date.split('/').map(Number);
    return new Date(currentYear, month - 1, day);
  }
}
