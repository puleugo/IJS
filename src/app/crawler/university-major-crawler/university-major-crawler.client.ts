import { Injectable } from '@nestjs/common';
import { CrawlerClient } from '@infrastructure/utils/crawler.client';
import * as puppeteer from 'puppeteer';
import { Repository } from 'typeorm';
import { UniversityMajor } from '@domain/university/university-major.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UniversityDepartment } from '@domain/university/university-department.entity';
import { Crawler } from '@domain/crawler/crawler.entity';

@Injectable()
export class UniversityMajorCrawlerClient implements CrawlerClient {
  constructor(
    @InjectRepository(UniversityMajor)
    private readonly universityMajorRepository: Repository<UniversityMajor>,
    @InjectRepository(UniversityDepartment)
    private readonly universityDepartmentRepository: Repository<UniversityDepartment>,
    @InjectRepository(Crawler)
    private readonly crawlerRepository: Repository<Crawler>,
  ) {}

  async crawl(): Promise<any> {
    const url = 'https://www.inje.ac.kr/kor/academics/academics.asp';
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();
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

    const departments: {
      name: string;
      url: string;
      slug: string;
      departmentName: string;
      departmentUrl: string | null;
    }[][] = await page.$$eval('#organization > div > div', (departments) => {
      return departments.map((department) => {
        const departmentName = department.querySelector('h3').textContent;
        const departmentUrl = department.querySelector('a').href;
        const majors = Array.from(department.querySelectorAll('li'));

        return majors.map((major) => {
          const name = major.textContent;
          const url = major.querySelector('a').href;
          const slug = url
            .replace(/^(https?:\/\/)?/, '')
            .replace(/\.inje\.ac\.kr\//, '');
          return {
            name,
            url,
            slug,
            departmentName,
            departmentUrl,
          };
        });
      });
    });

    departments.map(async (departmentData) => {
      let department: UniversityDepartment;
      department = await this.universityDepartmentRepository.findOne({
        where: { name: departmentData[0].departmentName },
      });
      if (!department) {
        department = await this.universityDepartmentRepository.save({
          name: departmentData[0].departmentName,
          url: departmentData[0].departmentUrl
            ? departmentData[0].departmentUrl
            : null,
        });
      }
      await Promise.all(
        departmentData.map(async (s): Promise<UniversityMajor> => {
          return await this.universityMajorRepository.save({
            name: s.name,
            url: s.url,
            department,
          });
        }),
      );
    });

    await browser.close();
    return;
  }

  async getStatus(): Promise<any> {
    return;
  }

  async initialize(
    name: 'university-major-crawler',
    executeIntervalHours: number,
  ): Promise<void> {
    const crawler = await this.crawlerRepository.findOne({ where: { name } });
    if (!crawler) {
      await this.crawlerRepository.save({
        name,
        executeIntervalHours,
      });
      return;
    }
    await this.crawlerRepository.update(crawler, { executeIntervalHours });
  }
}
