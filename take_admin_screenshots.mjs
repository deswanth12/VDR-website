// take_admin_screenshots.mjs
import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\db3b1753-ca5c-451a-aafe-9c39dc536640';
const BASE_URL = 'http://localhost:3000';

async function run() {
  // 1. Authenticate via direct API to get official session cookie
  const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@vijayadurgarefrigeration.com',
      password: 'VdrAdmin@2026!',
    }),
  });

  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get('set-cookie');
  const token = setCookie ? setCookie.split(';')[0].split('=')[1] : '';

  console.log('API Login result:', loginData.success, 'Token:', token ? 'present' : 'missing');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Capture Login Screen
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_login.png') });
  console.log('Captured admin_login.png');

  // Set authenticated session cookie
  await page.setCookie({
    name: 'vdr_admin_session',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  // 2. Capture Dashboard (Desktop)
  await page.goto(`${BASE_URL}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_dashboard.png') });
  console.log('Captured admin_dashboard.png');

  // 3. Capture Products List
  await page.goto(`${BASE_URL}/admin/products`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_products.png') });
  console.log('Captured admin_products.png');

  // 4. Capture Product New Editor
  await page.goto(`${BASE_URL}/admin/products/new`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_product_new.png') });
  console.log('Captured admin_product_new.png');

  // 5. Capture Categories
  await page.goto(`${BASE_URL}/admin/categories`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_categories.png') });
  console.log('Captured admin_categories.png');

  // 6. Capture Brands
  await page.goto(`${BASE_URL}/admin/brands`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_brands.png') });
  console.log('Captured admin_brands.png');

  // 7. Capture Enquiries
  await page.goto(`${BASE_URL}/admin/enquiries`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_enquiries.png') });
  console.log('Captured admin_enquiries.png');

  // 8. Capture Business Info
  await page.goto(`${BASE_URL}/admin/business`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_business.png') });
  console.log('Captured admin_business.png');

  // 9. Capture Homepage Controls
  await page.goto(`${BASE_URL}/admin/homepage`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_homepage.png') });
  console.log('Captured admin_homepage.png');

  // 10. Capture Settings & Security Controls
  await page.goto(`${BASE_URL}/admin/settings`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_settings.png') });
  console.log('Captured admin_settings.png');

  // 11. Capture Bulk Ingestion Page
  await page.goto(`${BASE_URL}/admin/import`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_import.png') });
  console.log('Captured admin_import.png');

  // 10. Mobile Dashboard (390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto(`${BASE_URL}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_admin_dashboard.png') });
  console.log('Captured mobile_admin_dashboard.png');

  // 11. Mobile Products List (390x844)
  await page.goto(`${BASE_URL}/admin/products`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_admin_products.png') });
  console.log('Captured mobile_admin_products.png');

  await browser.close();
  console.log('All admin screenshots captured successfully!');
}

run().catch(console.error);
