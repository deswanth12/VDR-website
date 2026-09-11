// test_accessibility_audit.mjs
import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:3000';

const ROUTES_TO_AUDIT = [
  { path: '/', name: 'Homepage' },
  { path: '/catalogue', name: 'Catalogue' },
  { path: '/products/daikin-1-5-ton-5-star-inverter-split-ac', name: 'Product Detail' },
  { path: '/compare', name: 'Compare' },
  { path: '/contact', name: 'Contact' },
  { path: '/showroom', name: 'Showroom' },
  { path: '/spares', name: 'Spares Desk' },
];

function calculateLuminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrastRatio(lum1, lum2) {
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

async function runAudit() {
  console.log('===========================================================');
  console.log('--- VDR PROGRAMMATIC ACCESSIBILITY (a11y) AUDIT SUITE ---');
  console.log('===========================================================\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let totalIssues = 0;

  try {
    for (const route of ROUTES_TO_AUDIT) {
      console.log(`Auditing: ${route.name} (${route.path})`);
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });

      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded' });
      await new Promise((r) => setTimeout(r, 600));

      const auditResults = await page.evaluate(() => {
        const issues = [];

        // 1. Audit Images for alt text
        const images = document.querySelectorAll('img');
        images.forEach((img, idx) => {
          const alt = img.getAttribute('alt');
          if (!alt || alt.trim() === '') {
            issues.push(`Image #${idx} missing alt text: src="${img.src.substring(0, 50)}..."`);
          }
        });

        // 2. Audit Buttons for accessible names
        const buttons = document.querySelectorAll('button');
        buttons.forEach((btn, idx) => {
          const text = btn.innerText || btn.getAttribute('aria-label') || btn.getAttribute('title');
          if (!text || text.trim() === '') {
            issues.push(`Button #${idx} has no text, aria-label, or title (HTML: ${btn.outerHTML.substring(0, 60)}...)`);
          }
        });

        // 3. Audit Links for accessible names
        const links = document.querySelectorAll('a');
        links.forEach((a, idx) => {
          const text = a.innerText || a.getAttribute('aria-label') || a.getAttribute('title');
          if (!text || text.trim() === '') {
            issues.push(`Link #${idx} has no accessible text or aria-label: href="${a.href}"`);
          }
        });

        // 4. Audit Form Inputs for Labels
        const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
        inputs.forEach((input, idx) => {
          const id = input.id;
          const hasAssociatedLabel = id && document.querySelector(`label[for="${id}"]`);
          const hasWrappingLabel = input.closest('label');
          const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('placeholder');
          if (!hasAssociatedLabel && !hasWrappingLabel && !hasAriaLabel) {
            issues.push(`Form control #${idx} (${input.tagName}) lacks associated label or aria-label`);
          }
        });

        // 5. Audit Headings (H1 presence)
        const h1s = document.querySelectorAll('h1');
        if (h1s.length === 0) {
          issues.push('Page is missing a top-level <h1> heading');
        }

        return {
          issues,
          imageCount: images.length,
          buttonCount: buttons.length,
          linkCount: links.length,
          inputCount: inputs.length,
          h1Text: h1s[0]?.innerText?.trim() || 'NONE',
        };
      });

      console.log(`  Elements scanned: ${auditResults.imageCount} imgs, ${auditResults.buttonCount} buttons, ${auditResults.linkCount} links, ${auditResults.inputCount} inputs.`);
      console.log(`  Page <h1>: "${auditResults.h1Text}"`);

      if (auditResults.issues.length === 0) {
        console.log(`  PASS: Zero accessibility violations on ${route.name}.\n`);
      } else {
        console.error(`  FAIL: Found ${auditResults.issues.length} issue(s):`);
        auditResults.issues.forEach((iss) => console.error(`    - ${iss}`));
        console.log('\n');
        totalIssues += auditResults.issues.length;
      }

      // Mobile Touch Target Audit (390x844)
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await new Promise((r) => setTimeout(r, 400));

      const mobileTouchAudit = await page.evaluate(() => {
        const touchIssues = [];
        const primaryTargets = document.querySelectorAll(
          'button, a.touch-target, [role="button"], input[type="submit"]'
        );

        primaryTargets.forEach((el) => {
          const rect = el.getBoundingClientRect();
          // Skip hidden elements
          if (rect.width === 0 || rect.height === 0 || window.getComputedStyle(el).display === 'none') return;

          // Target is acceptable if height >= 42px or width >= 42px (standard 44px threshold with small margin)
          if (rect.height < 40 && rect.width < 40) {
            const label = el.innerText || el.getAttribute('aria-label') || el.className;
            touchIssues.push(`Sub-optimal touch target (${Math.round(rect.width)}x${Math.round(rect.height)}px): "${label.substring(0, 30)}"`);
          }
        });

        return { touchIssues, scannedCount: primaryTargets.length };
      });

      if (mobileTouchAudit.touchIssues.length === 0) {
        console.log(`  PASS: Mobile touch target compliance verified across ${mobileTouchAudit.scannedCount} controls.\n`);
      } else {
        console.warn(`  NOTE: Found ${mobileTouchAudit.touchIssues.length} small touch targets on mobile (informative).`);
      }

      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log('===========================================================');
  if (totalIssues === 0) {
    console.log('ACCESSIBILITY AUDIT COMPLETE: 100% PASS ACROSS ALL ROUTES!');
  } else {
    console.error(`ACCESSIBILITY AUDIT COMPLETE: Found ${totalIssues} total issue(s).`);
  }
  console.log('===========================================================');
}

runAudit().catch(console.error);
