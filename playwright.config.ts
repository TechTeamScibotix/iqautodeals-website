import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for IQ Auto Deals demo recording
 *
 * RECORDING THE YOUTUBE VIDEO:
 *
 * 1. Set the demo URL (use latest Vercel deployment):
 *    export DEMO_URL="https://priceyourauto-xxx.vercel.app"
 *
 * 2. Run the recording (opens a browser window):
 *    npm run demo:record
 *
 * 3. Find your video at:
 *    test-results/youtube-demo-*.webm
 *
 * For testing without recording:
 *    npm run demo:test
 */
export default defineConfig({
  testDir: './scripts',
  testMatch: '**/*.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }]],

  use: {
    // Capture screenshot on failure
    screenshot: 'only-on-failure',

    // Record video for all tests (1080p for YouTube)
    video: {
      mode: 'on',
      size: { width: 1920, height: 1080 },
    },

    // Trace on failure
    trace: 'on-first-retry',

    // Action timeout
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          slowMo: 300, // Slow down for video recording (smooth animations)
        },
      },
    },
    {
      name: 'chromium-fast',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // No slowMo for testing
      },
    },
  ],

  // Output folder for test artifacts (videos saved here)
  outputDir: 'test-results',
});
