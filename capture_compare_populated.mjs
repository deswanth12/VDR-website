import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  const artifactDir = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\db3b1753-ca5c-451a-aafe-9c39dc536640';
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1100 });
  await page.goto('http://localhost:3000/compare', { waitUntil: 'networkidle0' });
  
  // Click first preset
  const preset = await page.$('.grid > div');
  if (preset) {
    await preset.click();
    await new Promise(r => setTimeout(r, 800));
  }
  await page.screenshot({ path: path.join(artifactDir, 'desktop_compare_populated.png') });
  await browser.close();
}
run();
