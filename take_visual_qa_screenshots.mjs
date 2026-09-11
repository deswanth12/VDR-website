// take_visual_qa_screenshots.mjs
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

  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1280, height: 900 });

  await desktopPage.setCookie({
    name: 'vdr_admin_session',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  const desktopRoutes = [
    { url: '/admin/dashboard', name: 'admin_dashboard.png' },
    { url: '/admin/products', name: 'admin_products.png' },
    { url: '/admin/products/new', name: 'admin_product_new.png' },
    { url: '/admin/enquiries', name: 'admin_enquiries.png' },
    { url: '/admin/settings', name: 'admin_settings.png' },
    { url: '/admin/import', name: 'admin_import.png' },
    { url: '/', name: 'public_homepage.png' },
    { url: '/catalogue', name: 'public_catalogue.png' },
    { url: '/products/daikin-1-5-ton-5-star-inverter-split-ac', name: 'public_product_detail.png' },
    { url: '/compare', name: 'public_compare.png' },
    { url: '/showroom', name: 'public_showroom.png' },
    { url: '/contact', name: 'public_contact.png' },
  ];

  for (const r of desktopRoutes) {
    await desktopPage.goto(`${BASE_URL}${r.url}`, { waitUntil: 'domcontentloaded' });
    await new Promise((res) => setTimeout(res, 600));
    await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, r.name) });
    console.log(`Captured desktop: ${r.name}`);
  }

  // Mobile Viewport 390x844
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await mobilePage.setCookie({
    name: 'vdr_admin_session',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  const mobileRoutes = [
    { url: '/admin/dashboard', name: 'mobile_admin_dashboard.png' },
    { url: '/admin/products', name: 'mobile_admin_products.png' },
    { url: '/admin/products/new', name: 'mobile_admin_product_new.png' },
    { url: '/admin/enquiries', name: 'mobile_admin_enquiries.png' },
    { url: '/admin/settings', name: 'mobile_admin_settings.png' },
    { url: '/', name: 'mobile_public_homepage.png' },
    { url: '/catalogue', name: 'mobile_public_catalogue.png' },
    { url: '/products/daikin-1-5-ton-5-star-inverter-split-ac', name: 'mobile_public_product_detail.png' },
    { url: '/compare', name: 'mobile_public_compare.png' },
    { url: '/contact', name: 'mobile_public_contact.png' },
  ];

  for (const r of mobileRoutes) {
    await mobilePage.goto(`${BASE_URL}${r.url}`, { waitUntil: 'domcontentloaded' });
    await new Promise((res) => setTimeout(res, 600));
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, r.name) });
    console.log(`Captured mobile: ${r.name}`);
  }

  await browser.close();
  console.log('All visual QA screenshots captured successfully!');
}

run().catch(console.error);
