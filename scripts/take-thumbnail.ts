import { test } from '@playwright/test';

const SITE_URL = process.env.DEMO_URL || 'https://priceyourauto-4yo3i9gtk-scibotix-solutions-llc.vercel.app';

test('Take thumbnail screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Handle alerts
  page.on('dialog', d => d.accept());

  // Register new user
  await page.goto(`${SITE_URL}/register`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);

  await page.click('button:has-text("Customer")');
  await page.waitForTimeout(500);

  const ts = Date.now();
  await page.fill('input[placeholder*="John"]', 'Demo User');
  await page.fill('input[placeholder*="555"]', '5551234567');
  await page.fill('input[placeholder*="email"]', `thumb${ts}@demo.com`);
  await page.fill('input[placeholder*="password"]', 'Demo123!');

  await page.click('button:has-text("Create Account")');
  await page.waitForURL('**/customer**', { timeout: 15000 });
  await page.waitForTimeout(2000);

  // Wait for cars
  await page.waitForSelector('button:has-text("Add")', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Select 3 cars
  for (let i = 0; i < 3; i++) {
    await page.locator('button:has-text("Add")').first().click();
    await page.waitForTimeout(500);
  }

  // Scroll to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Take screenshot
  await page.screenshot({ path: 'youtube-thumbnail.png' });
  console.log('Thumbnail saved to youtube-thumbnail.png');
});
