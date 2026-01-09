/**
 * IQ Auto Deals - YouTube Demo Script
 *
 * This Playwright script automates the customer journey for screen recording.
 *
 * To record the demo:
 * npm run demo:record
 *
 * Or run directly with slow motion:
 * npx playwright test scripts/youtube-demo.ts --headed --project=chromium
 */

import { test } from '@playwright/test';

// Increase test timeout for the demo
test.setTimeout(180000);

// Demo customer data
const DEMO_CUSTOMER = {
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@email.com',
  phone: '5551234567', // Numbers only, the form will format it
  zipCode: '30301',
  comments: 'Looking to test drive this weekend. Available Saturday afternoon.',
};

/**
 * Site URL Configuration:
 *
 * For local development:
 *   const SITE_URL = 'http://localhost:5050';
 *
 * For production (update with your Vercel URL):
 *   const SITE_URL = 'https://your-app.vercel.app';
 *
 * Or set via environment variable:
 *   DEMO_URL=https://your-site.com npm run demo:record
 */
const SITE_URL = process.env.DEMO_URL || 'http://localhost:5050';

test.describe('IQ Auto Deals Customer Journey', () => {
  test('Complete customer flow from browsing to deal request', async ({ page }) => {
    // Set viewport for a nice recording size (16:9 aspect ratio)
    await page.setViewportSize({ width: 1920, height: 1080 });

    // ============================================
    // SCENE 1: Homepage - The Starting Point
    // ============================================
    console.log('Scene 1: Visiting Homepage...');
    await page.goto(SITE_URL);
    await page.waitForLoadState('load');

    // Pause to show the homepage
    await page.waitForTimeout(3000);

    // ============================================
    // SCENE 2: Navigate to Browse Cars
    // ============================================
    console.log('Scene 2: Navigating to Browse Cars...');

    // Look for the "Browse Cars" or navigation link
    const browseLink = page.locator('a[href="/cars"], a:has-text("Browse"), a:has-text("Inventory"), a:has-text("Find")').first();

    if (await browseLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await browseLink.hover();
      await page.waitForTimeout(500);
      await browseLink.click();
    } else {
      // Direct navigation if link not found
      await page.goto(`${SITE_URL}/cars`);
    }

    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    // ============================================
    // SCENE 3: Browse the Inventory
    // ============================================
    console.log('Scene 3: Browsing the inventory...');

    // Wait for cars to load - look for the grid container
    await page.waitForSelector('.grid', { timeout: 15000 });
    await page.waitForTimeout(2000);

    // Scroll down slowly to show the inventory
    await smoothScroll(page, 400);
    await page.waitForTimeout(2000);

    // ============================================
    // SCENE 4: View a Car Card
    // ============================================
    console.log('Scene 4: Viewing car options...');

    // Scroll back up to see the first car cards
    await smoothScroll(page, -200);
    await page.waitForTimeout(1000);

    // Find the first "Check Availability - Test Drive" button directly
    const checkAvailabilityBtn = page.locator('button:has-text("Check Availability - Test Drive")').first();

    // Scroll to make it visible
    await checkAvailabilityBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // ============================================
    // SCENE 5: Click Check Availability
    // ============================================
    console.log('Scene 5: Clicking Check Availability...');

    // Hover over the button
    await checkAvailabilityBtn.hover();
    await page.waitForTimeout(800);

    // Click the button
    await checkAvailabilityBtn.click();
    await page.waitForTimeout(1500);

    // ============================================
    // SCENE 6: Fill Out the Form
    // ============================================
    console.log('Scene 6: Filling out the request form...');

    // Wait for the modal to appear
    await page.waitForSelector('input#firstName, input[name="firstName"]', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Fill out first name with typing animation
    const firstNameInput = page.locator('input#firstName, input[name="firstName"]').first();
    await firstNameInput.click();
    await page.waitForTimeout(300);
    await typeSlowly(page, firstNameInput, DEMO_CUSTOMER.firstName);
    await page.waitForTimeout(400);

    // Fill out last name
    const lastNameInput = page.locator('input#lastName, input[name="lastName"]').first();
    await lastNameInput.click();
    await page.waitForTimeout(300);
    await typeSlowly(page, lastNameInput, DEMO_CUSTOMER.lastName);
    await page.waitForTimeout(400);

    // Fill out email
    const emailInput = page.locator('input#email, input[name="email"], input[type="email"]').first();
    await emailInput.click();
    await page.waitForTimeout(300);
    await typeSlowly(page, emailInput, DEMO_CUSTOMER.email);
    await page.waitForTimeout(400);

    // Fill out phone
    const phoneInput = page.locator('input#phone, input[name="phone"], input[type="tel"]').first();
    await phoneInput.click();
    await page.waitForTimeout(300);
    await typeSlowly(page, phoneInput, DEMO_CUSTOMER.phone);
    await page.waitForTimeout(400);

    // Fill out zip code
    const zipInput = page.locator('input#zipCode, input[name="zipCode"], input[name="zip"]').first();
    await zipInput.click();
    await page.waitForTimeout(300);
    await typeSlowly(page, zipInput, DEMO_CUSTOMER.zipCode);
    await page.waitForTimeout(400);

    // Fill out comments (optional)
    const commentsInput = page.locator('textarea#comments, textarea[name="comments"]').first();
    if (await commentsInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await commentsInput.click();
      await page.waitForTimeout(300);
      await typeSlowly(page, commentsInput, DEMO_CUSTOMER.comments);
      await page.waitForTimeout(800);
    }

    // ============================================
    // SCENE 7: Submit the Request
    // ============================================
    console.log('Scene 7: Submitting the request...');

    // Find the submit button
    const submitBtn = page.locator('button[type="submit"], button:has-text("Check Availability")').last();

    // Scroll to make the button visible
    await submitBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Hover over the button
    await submitBtn.hover();
    await page.waitForTimeout(500);

    // Click submit
    await submitBtn.click();

    // Wait for the success state
    await page.waitForTimeout(3000);

    // ============================================
    // SCENE 8: Success Confirmation
    // ============================================
    console.log('Scene 8: Showing success confirmation...');

    // Wait for success message to appear
    await page.waitForSelector('text=Request Submitted, text=Success, .bg-green-100', { timeout: 10000 }).catch(() => {});

    // Wait to show the success message
    await page.waitForTimeout(5000);

    // Close the modal if there's a Done button
    const doneBtn = page.locator('button:has-text("Done"), button:has-text("Close")').first();
    if (await doneBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await doneBtn.hover();
      await page.waitForTimeout(500);
      await doneBtn.click();
    }

    await page.waitForTimeout(2000);

    // ============================================
    // END: Final pause before video ends
    // ============================================
    console.log('Demo complete!');
    await page.waitForTimeout(3000);
  });
});

/**
 * Smooth scroll helper function for cinematic effect
 */
async function smoothScroll(page: any, distance: number) {
  const steps = 20;
  const stepDistance = distance / steps;
  const stepDelay = 30;

  for (let i = 0; i < steps; i++) {
    await page.evaluate((dist: number) => {
      window.scrollBy(0, dist);
    }, stepDistance);
    await page.waitForTimeout(stepDelay);
  }
}

/**
 * Type text slowly for better video effect
 */
async function typeSlowly(page: any, locator: any, text: string) {
  for (const char of text) {
    await locator.pressSequentially(char, { delay: 50 });
  }
}
