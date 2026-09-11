// capture_import_preview.mjs
import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\db3b1753-ca5c-451a-aafe-9c39dc536640';
const BASE_URL = 'http://localhost:3000';

async function run() {
  const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@vijayadurgarefrigeration.com',
      password: 'VdrAdmin@2026!',
    }),
  });

  const setCookie = loginRes.headers.get('set-cookie');
  const token = setCookie ? setCookie.split(';')[0].split('=')[1] : '';

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  await page.setCookie({
    name: 'vdr_admin_session',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  await page.goto(`${BASE_URL}/admin/import`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 600));

  const sampleCsv = `name,brand,category,model,sku,tonnageOrCapacity,starRating,features,specs
"Panasonic 1.5 Ton 5-Star Wi-Fi Inverter AC","Panasonic","split-ac","CS-NU18WKYW","PANASONIC-NU18-PREVIEW","1.5 Ton","5","Miraie App IoT Control | nanoe-G Air Purification","Cooling:5100W | Refrigerant:R32"
"Daikin 1.5 Ton 5-Star Inverter Split AC","Daikin","split-ac","FTKM Series","DAIKIN-FTKM50-DEMO","1.5 Ton","5","PM 2.5 Filter | Coanda Airflow","Cooling:5000W"
"","Carrier","split-ac","","","","","Missing Title Error",""`;

  await page.type('textarea', sampleCsv);
  await page.click('button[type="button"]');
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_import_preview.png') });
  console.log('Captured admin_import_preview.png successfully!');

  await browser.close();
}

run().catch(console.error);
