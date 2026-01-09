/**
 * IQ Auto Deals - YouTube Demo: Complete Customer Journey
 *
 * This script shows the core feature: customer registering, signing in,
 * and selecting 3 cars to request a deal from dealers.
 *
 * To record: DEMO_URL="https://your-site.vercel.app" npm run demo:deal
 */

import { test } from '@playwright/test';

// Increase test timeout for the demo
test.setTimeout(300000);

// Generate unique email for demo
const timestamp = Date.now();
const DEMO_CUSTOMER = {
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: `sarah.demo${timestamp}@example.com`,
  password: 'Demo123!',
  phone: '5551234567',
  zip: '30301',
};

// Site URL
const SITE_URL = process.env.DEMO_URL || 'http://localhost:5050';

test.describe('IQ Auto Deals - Complete Customer Journey', () => {
  test('Customer registers, signs in, and requests deal on 3 cars', async ({ page }) => {
    // Set viewport for a nice recording size (16:9 aspect ratio)
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Handle alerts automatically
    page.on('dialog', async dialog => {
      console.log(`Alert: ${dialog.message()}`);
      await page.waitForTimeout(2000);
      await dialog.accept();
    });

    // ============================================
    // SCENE 1: Homepage
    // ============================================
    console.log('Scene 1: Visiting Homepage...');
    await page.goto(SITE_URL);
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // ============================================
    // SCENE 2: Navigate to Sign Up
    // ============================================
    console.log('Scene 2: Navigating to Sign Up...');

    const signUpLink = page.locator('a[href="/register"], a:has-text("Sign Up"), a:has-text("Create Account")').first();
    await signUpLink.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await signUpLink.hover();
    await page.waitForTimeout(500);
    await signUpLink.click();

    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    // ============================================
    // SCENE 3: Registration Form
    // ============================================
    console.log('Scene 3: Filling registration form...');

    // Wait for registration form - look for the Customer/Dealer choice buttons
    await page.waitForSelector('button:has-text("Customer"), button:has-text("I\'m a Customer")', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Click "I'm a Customer" button
    const customerBtn = page.locator('button:has-text("Customer")').first();
    await customerBtn.hover();
    await page.waitForTimeout(500);
    await customerBtn.click();
    await page.waitForTimeout(1000);

    // Fill name (look for textbox with "John Smith" placeholder or similar)
    const nameInput = page.locator('input[placeholder*="John"], input[placeholder*="Name"], [role="textbox"]').first();
    await nameInput.click();
    await page.waitForTimeout(300);
    await typeSlowly(page, nameInput, `${DEMO_CUSTOMER.firstName} ${DEMO_CUSTOMER.lastName}`);
    await page.waitForTimeout(400);

    // Fill phone
    const phoneInput = page.locator('input[placeholder*="555"], input[placeholder*="phone"], input[type="tel"]').first();
    if (await phoneInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await phoneInput.click();
      await page.waitForTimeout(300);
      await typeSlowly(page, phoneInput, DEMO_CUSTOMER.phone);
      await page.waitForTimeout(400);
    }

    // Fill email
    const emailInput = page.locator('input[placeholder*="email"], input[type="email"]').first();
    await emailInput.click();
    await page.waitForTimeout(300);
    await typeSlowly(page, emailInput, DEMO_CUSTOMER.email);
    await page.waitForTimeout(400);

    // Fill password
    const passwordInput = page.locator('input[placeholder*="password"], input[type="password"]').first();
    await passwordInput.click();
    await page.waitForTimeout(300);
    await typeSlowly(page, passwordInput, DEMO_CUSTOMER.password);
    await page.waitForTimeout(400);

    // Click Create Account button
    const registerBtn = page.locator('button:has-text("Create Account")').first();
    await registerBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await registerBtn.hover();
    await page.waitForTimeout(500);
    await registerBtn.click();

    // Wait for redirect
    await page.waitForURL('**/customer**', { timeout: 20000 }).catch(() => {
      // If redirected to login, we need to sign in
    });
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // If we're on login page, sign in
    if (page.url().includes('/login')) {
      console.log('Scene 3b: Signing in after registration...');

      const loginEmailInput = page.locator('input[type="email"]').first();
      await loginEmailInput.click();
      await typeSlowly(page, loginEmailInput, DEMO_CUSTOMER.email);

      const loginPasswordInput = page.locator('input[type="password"]').first();
      await loginPasswordInput.click();
      await typeSlowly(page, loginPasswordInput, DEMO_CUSTOMER.password);

      const signInBtn = page.locator('button[type="submit"]').first();
      await signInBtn.click();

      await page.waitForURL('**/customer**', { timeout: 15000 });
      await page.waitForLoadState('load');
      await page.waitForTimeout(3000);
    }

    // ============================================
    // SCENE 4: Customer Dashboard - Browse Cars
    // ============================================
    console.log('Scene 4: Browsing available cars...');

    // Wait for cars to load
    await page.waitForSelector('button:has-text("Add"), button:has-text("Selected")', { timeout: 15000 });
    await page.waitForTimeout(2000);

    // Scroll to show the car grid
    await smoothScroll(page, 300);
    await page.waitForTimeout(2000);

    // ============================================
    // SCENE 5: Select First Car
    // ============================================
    console.log('Scene 5: Selecting first car...');

    const firstAddBtn = page.locator('button:has-text("Add")').first();
    await firstAddBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await firstAddBtn.hover();
    await page.waitForTimeout(500);
    await firstAddBtn.click();
    await page.waitForTimeout(1500);

    // ============================================
    // SCENE 6: Select Second Car
    // ============================================
    console.log('Scene 6: Selecting second car...');

    await smoothScroll(page, 150);
    await page.waitForTimeout(800);

    const secondAddBtn = page.locator('button:has-text("Add")').first();
    await secondAddBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await secondAddBtn.hover();
    await page.waitForTimeout(500);
    await secondAddBtn.click();
    await page.waitForTimeout(1500);

    // ============================================
    // SCENE 7: Select Third Car
    // ============================================
    console.log('Scene 7: Selecting third car...');

    await smoothScroll(page, 150);
    await page.waitForTimeout(800);

    const thirdAddBtn = page.locator('button:has-text("Add")').first();
    await thirdAddBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await thirdAddBtn.hover();
    await page.waitForTimeout(500);
    await thirdAddBtn.click();
    await page.waitForTimeout(2000);

    // ============================================
    // SCENE 8: Show Selection Summary
    // ============================================
    console.log('Scene 8: Showing selection summary...');

    // Scroll to top to show the selection summary bar
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2500);

    // ============================================
    // SCENE 9: Click "Make Me A Deal!"
    // ============================================
    console.log('Scene 9: Clicking Make Me A Deal...');

    const makeDealBtn = page.locator('button:has-text("Make Me A Deal"), button:has-text("Add to Deal Request")').first();
    await makeDealBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await makeDealBtn.hover();
    await page.waitForTimeout(800);
    await makeDealBtn.click();

    await page.waitForTimeout(4000);

    // ============================================
    // SCENE 10: View My Deals Page
    // ============================================
    console.log('Scene 10: Viewing My Deals page...');

    // Wait for redirect to deals page
    await page.waitForURL('**/customer/deals**', { timeout: 10000 }).catch(async () => {
      // If not redirected, click My Deals button
      const myDealsBtn = page.locator('button:has-text("My Deals"), a:has-text("My Deals")').first();
      if (await myDealsBtn.isVisible()) {
        await myDealsBtn.click();
        await page.waitForLoadState('load');
      }
    });

    await page.waitForTimeout(3000);

    // Show the deal request
    await page.waitForSelector('text=Deal Request, text=3 Vehicles, text=Vehicles', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // Scroll to show deal details
    await smoothScroll(page, 300);
    await page.waitForTimeout(3000);

    // ============================================
    // END: Final pause
    // ============================================
    console.log('Demo complete!');
    await page.waitForTimeout(5000);
  });
});

/**
 * Smooth scroll helper
 */
async function smoothScroll(page: any, distance: number) {
  const steps = 20;
  const stepDistance = distance / steps;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((dist: number) => window.scrollBy(0, dist), stepDistance);
    await page.waitForTimeout(30);
  }
}

/**
 * Type text slowly for video effect
 */
async function typeSlowly(page: any, locator: any, text: string) {
  for (const char of text) {
    await locator.pressSequentially(char, { delay: 40 });
  }
}
