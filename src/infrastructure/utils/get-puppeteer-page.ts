import * as puppeteer from 'puppeteer';

export async function getPuppeteerPage(
  browser: puppeteer.Browser,
  url: string,
): Promise<puppeteer.Page> {
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
  return page;
}
