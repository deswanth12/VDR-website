// capture_restore_modal.mjs
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

  // Create a sample snapshot
  await fetch(`${BASE_URL}/api/admin/backup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `vdr_admin_session=${token}`,
    },
    body: JSON.stringify({ name: 'Pre-Launch Staging Baseline' }),
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  await page.setCookie({
    name: 'vdr_admin_session',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  await page.goto(`${BASE_URL}/admin/settings`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1000));

  // Click the "Restore" button on the snapshot row
  const restoreButtons = await page.$$('button');
  for (const btn of restoreButtons) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text.includes('Restore')) {
      await btn.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_restore_modal.png') });
  console.log('Captured admin_restore_modal.png successfully!');

  await browser.close();
}

run().catch(console.error);
