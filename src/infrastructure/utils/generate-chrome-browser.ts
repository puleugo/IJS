import * as puppeteer from 'puppeteer';

export async function generateChromeBrowser(): Promise<puppeteer.Browser> {
  const isDevMode = process.env.ENV === 'dev';
  if (isDevMode) return await generateChromeBrowserDevMode();
  return await puppeteer.launch({
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

async function generateChromeBrowserDevMode(): Promise<puppeteer.Browser> {
  return await puppeteer.launch({
    headless: 'new',
    waitForInitialPage: true,
  });
}
