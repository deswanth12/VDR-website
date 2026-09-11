// take_all_screenshots.mjs
import puppeteer from 'puppeteer';
import path from 'path';

const artifactDir = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\db3b1753-ca5c-451a-aafe-9c39dc536640';

const desktopTargets = [
  { name: 'desktop_home.png', url: 'http://localhost:3000/' },
  { name: 'desktop_catalogue.png', url: 'http://localhost:3000/catalogue' },
  { name: 'desktop_pdp.png', url: 'http://localhost:3000/products/daikin-1-5-ton-5-star-inverter-split-ac' },
  { name: 'desktop_compare.png', url: 'http://localhost:3000/compare' },
  { name: 'desktop_services.png', url: 'http://localhost:3000/services' },
  { name: 'desktop_showroom.png', url: 'http://localhost:3000/showroom' },
  { name: 'desktop_contact.png', url: 'http://localhost:3000/contact' },
];

const mobileTargets = [
  { name: 'mobile_home.png', url: 'http://localhost:3000/' },
  { name: 'mobile_catalogue.png', url: 'http://localhost:3000/catalogue' },
  { name: 'mobile_pdp.png', url: 'http://localhost:3000/products/daikin-1-5-ton-5-star-inverter-split-ac' },
];

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Capture Desktop Screenshots
  for (const item of desktopTargets) {
    console.log(`Capturing Desktop: ${item.name}`);
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    await page.goto(item.url, { waitUntil: 'networkidle0', timeout: 30000 });
    // small settle delay
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(artifactDir, item.name), fullPage: false });
  }

  // 2. Capture Mobile Screenshots (iPhone 14 / Samsung Galaxy Mobile Viewport)
  for (const item of mobileTargets) {
    console.log(`Capturing Mobile: ${item.name}`);
    await page.setViewport({
      width: 390,
      height: 844,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    });
    await page.goto(item.url, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(artifactDir, item.name), fullPage: false });
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
