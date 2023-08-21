import { Browser, launch } from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilService {
  constructor(private readonly configService: ConfigService) {}

  async generateChromeBrowser(): Promise<Browser> {
    const isDevMode = this.configService.get('ENV', 'dev') === 'dev';
    if (isDevMode) return await this.generateChromeBrowserDevMode();
    return await launch({
      headless: 'new',
      executablePath: process.env.CHROME_BIN || null,
      waitForInitialPage: true,
      args: [
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
    });
  }

  private async generateChromeBrowserDevMode(): Promise<Browser> {
    return await launch({
      headless: 'new',
      waitForInitialPage: true,
    });
  }
}
