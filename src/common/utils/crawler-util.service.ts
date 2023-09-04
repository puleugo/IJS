import {
	Browser, launch, Page,
} from 'puppeteer';
import { ConfigService, } from '@nestjs/config';
import { Injectable, } from '@nestjs/common';

@Injectable()
export class CrawlerUtilService {
	constructor(private readonly configService: ConfigService) {
	}

	async launch(): Promise<Browser> {
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

	async newFastPage(
		browser: Browser,
		url: string
	): Promise<Page> {
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
		await page.goto(url, { waitUntil: 'networkidle2', });

		return page;
	}

	private async generateChromeBrowserDevMode(): Promise<Browser> {
		return await launch({
			headless: 'new',
			waitForInitialPage: true,
		});
	}
}
