const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://iqautodeals.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'video-output');
const FRAMES_DIR = path.join(OUTPUT_DIR, 'customer-frames');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (fs.existsSync(FRAMES_DIR)) {
  fs.rmSync(FRAMES_DIR, { recursive: true });
}
fs.mkdirSync(FRAMES_DIR, { recursive: true });

let frameCount = 0;

async function captureFrame(page, duration = 1) {
  const framesNeeded = Math.max(1, duration * 2);
  for (let i = 0; i < framesNeeded; i++) {
    frameCount++;
    const framePath = path.join(FRAMES_DIR, `frame_${String(frameCount).padStart(5, '0')}.png`);
    await page.screenshot({ path: framePath, fullPage: false });
    await new Promise(r => setTimeout(r, 100));
  }
}

async function addTextOverlay(page, text, subtext = '') {
  await page.evaluate((text, subtext) => {
    const existing = document.getElementById('video-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'video-overlay';
    overlay.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, rgba(30, 58, 138, 0.95), rgba(59, 130, 246, 0.95));
      color: white;
      padding: 20px 40px;
      border-radius: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 999999;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      border: 2px solid rgba(255,255,255,0.2);
      max-width: 80%;
    `;
    overlay.innerHTML = `
      <div style="font-size: 28px; font-weight: 700; margin-bottom: ${subtext ? '8px' : '0'};">${text}</div>
      ${subtext ? `<div style="font-size: 18px; opacity: 0.9;">${subtext}</div>` : ''}
    `;
    document.body.appendChild(overlay);
  }, text, subtext);
}

async function removeOverlay(page) {
  await page.evaluate(() => {
    const overlay = document.getElementById('video-overlay');
    if (overlay) overlay.remove();
  });
}

async function smoothScroll(page, targetY, steps = 10) {
  const currentY = await page.evaluate(() => window.scrollY);
  const diff = targetY - currentY;
  const stepSize = diff / steps;

  for (let i = 0; i < steps; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), currentY + stepSize * (i + 1));
    await captureFrame(page, 0.2);
  }
}

async function createCustomerVideo() {
  console.log('Starting Customer Journey Video...\n');

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Scene 1: Homepage Landing
    console.log('Scene 1: Homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));

    await addTextOverlay(page, 'Welcome to IQ Auto Deals', 'Your trusted marketplace for quality used cars');
    await captureFrame(page, 4);
    await removeOverlay(page);

    // Scene 2: Show hero section
    console.log('Scene 2: Hero section...');
    await addTextOverlay(page, 'Find Your Perfect Car', 'Browse thousands of vehicles from trusted dealers');
    await captureFrame(page, 3);
    await removeOverlay(page);

    // Scene 3: Scroll to featured inventory
    console.log('Scene 3: Featured Inventory...');
    await smoothScroll(page, 600, 15);
    await new Promise(r => setTimeout(r, 1000));
    await addTextOverlay(page, 'Featured Inventory', 'Hand-picked vehicles at competitive prices');
    await captureFrame(page, 3);
    await removeOverlay(page);

    // Scene 4: Navigate to cars page (correct route)
    console.log('Scene 4: Browse All Cars...');
    await page.goto(`${BASE_URL}/cars`, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    await addTextOverlay(page, 'Browse Our Full Inventory', 'Filter by make, model, price and more');
    await captureFrame(page, 4);
    await removeOverlay(page);

    // Scene 5: Scroll through cars
    console.log('Scene 5: Viewing cars...');
    await smoothScroll(page, 400, 10);
    await captureFrame(page, 2);
    await smoothScroll(page, 800, 10);
    await captureFrame(page, 2);

    // Scene 6: Scroll back and look at cars
    console.log('Scene 6: Select a car...');
    await smoothScroll(page, 200, 8);
    await new Promise(r => setTimeout(r, 500));
    await addTextOverlay(page, 'Click Any Car for Details', 'Get full specifications and photos');
    await captureFrame(page, 3);
    await removeOverlay(page);

    // Scene 7: Browse by location
    console.log('Scene 7: Browse by location...');
    await page.goto(`${BASE_URL}/locations`, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    await addTextOverlay(page, 'Find Cars Near You', 'Browse by state and city');
    await captureFrame(page, 3);
    await removeOverlay(page);
    await smoothScroll(page, 400, 10);
    await captureFrame(page, 2);

    // Scene 8: Browse by model
    console.log('Scene 8: Browse by model...');
    await page.goto(`${BASE_URL}/models`, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    await addTextOverlay(page, 'Shop by Make & Model', 'Find exactly what you want');
    await captureFrame(page, 3);
    await removeOverlay(page);
    await smoothScroll(page, 300, 8);
    await captureFrame(page, 2);

    // Scene 9: Login page
    console.log('Scene 9: Login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 1500));
    await addTextOverlay(page, 'Sign In to Your Account', 'Access exclusive deals and save favorites');
    await captureFrame(page, 3);
    await removeOverlay(page);

    // Scene 10: Fill login form
    console.log('Scene 10: Logging in...');
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    const passwordInput = await page.$('input[type="password"], input[name="password"]');

    if (emailInput && passwordInput) {
      await emailInput.type('customer@example.com', { delay: 50 });
      await captureFrame(page, 1);
      await passwordInput.type('password123', { delay: 50 });
      await captureFrame(page, 1);
      await addTextOverlay(page, 'Secure Login', 'Your data is protected');
      await captureFrame(page, 2);
      await removeOverlay(page);
    }

    // Scene 11: Customer dashboard mock
    console.log('Scene 11: Customer Dashboard...');
    await page.setContent(`
      <div style="
        width: 100vw;
        height: 100vh;
        background: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 40px;
        box-sizing: border-box;
      ">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h1 style="font-size: 36px; color: #1e293b;">My Dashboard</h1>
            <div style="background: #3b82f6; color: white; padding: 10px 20px; border-radius: 8px;">Welcome, Customer!</div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
            <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
              <div style="font-size: 14px; color: #64748b;">Saved Cars</div>
              <div style="font-size: 42px; font-weight: 700; color: #3b82f6;">5</div>
            </div>
            <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
              <div style="font-size: 14px; color: #64748b;">Active Deals</div>
              <div style="font-size: 42px; font-weight: 700; color: #22c55e;">2</div>
            </div>
            <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
              <div style="font-size: 14px; color: #64748b;">Messages</div>
              <div style="font-size: 42px; font-weight: 700; color: #f59e0b;">3</div>
            </div>
          </div>

          <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 20px;">My Selected Cars</h2>
            <div style="display: flex; gap: 20px;">
              <div style="flex: 1; background: #f1f5f9; border-radius: 12px; overflow: hidden;">
                <div style="height: 120px;"><img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/4t1g11ak8pu123001-verified-P8BUyEDVewS8Mpac8pa1Qu0ZWufRDa.jpg" style="width:100%;height:100%;object-fit:cover;"></div>
                <div style="padding: 16px;">
                  <div style="font-weight: 600; color: #1e293b;">2023 Toyota Camry SE</div>
                  <div style="color: #64748b; font-size: 14px;">$28,500 | 15,000 mi</div>
                </div>
              </div>
              <div style="flex: 1; background: #f1f5f9; border-radius: 12px; overflow: hidden;">
                <div style="height: 120px;"><img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/1hgcv1f92na123002-verified-gStfeAnXwn3oosMabY7PNRIvySyOsj.jpg" style="width:100%;height:100%;object-fit:cover;"></div>
                <div style="padding: 16px;">
                  <div style="font-weight: 600; color: #1e293b;">2022 Honda Accord</div>
                  <div style="color: #64748b; font-size: 14px;">$31,000 | 22,000 mi</div>
                </div>
              </div>
              <div style="flex: 1; background: #f1f5f9; border-radius: 12px; overflow: hidden;">
                <div style="height: 120px;"><img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/5ux53dp08p9223005-verified-uIgvMhOqnZEYF3L05U4goaQzOPzxMX.jpg" style="width:100%;height:100%;object-fit:cover;"></div>
                <div style="padding: 16px;">
                  <div style="font-weight: 600; color: #1e293b;">2023 BMW X3 M40i</div>
                  <div style="color: #64748b; font-size: 14px;">$58,900 | 8,000 mi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
    await addTextOverlay(page, 'Your Personal Dashboard', 'Track saved cars and active deals');
    await captureFrame(page, 4);
    await removeOverlay(page);

    // Scene 12: Making a deal
    console.log('Scene 12: Making a deal...');
    await page.setContent(`
      <div style="
        width: 100vw;
        height: 100vh;
        background: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 40px;
        box-sizing: border-box;
      ">
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 36px; color: #1e293b; margin-bottom: 30px;">Make an Offer</h1>

          <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-bottom: 20px;">
            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
              <div style="width: 200px; height: 150px; border-radius: 12px; overflow: hidden;"><img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/4t1g11ak8pu123001-verified-P8BUyEDVewS8Mpac8pa1Qu0ZWufRDa.jpg" style="width:100%;height:100%;object-fit:cover;"></div>
              <div>
                <div style="font-size: 28px; font-weight: 600; color: #1e293b;">2023 Toyota Camry SE</div>
                <div style="font-size: 18px; color: #64748b; margin-top: 5px;">Listed Price: $28,500</div>
                <div style="font-size: 14px; color: #64748b; margin-top: 10px;">AutoMax Dealership | Birmingham, AL</div>
              </div>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
              <div style="font-size: 18px; color: #1e293b; margin-bottom: 15px;">Your Offer</div>
              <div style="display: flex; gap: 15px; align-items: center;">
                <input type="text" value="$27,500" style="font-size: 24px; padding: 15px 20px; border: 2px solid #3b82f6; border-radius: 12px; width: 200px; font-weight: 600;">
                <button style="background: #22c55e; color: white; border: none; padding: 15px 40px; border-radius: 12px; font-size: 18px; font-weight: 600; cursor: pointer;">Submit Offer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
    await addTextOverlay(page, 'Submit Your Offer', 'Negotiate directly with dealers');
    await captureFrame(page, 4);
    await removeOverlay(page);

    // Scene 13: Deal accepted
    console.log('Scene 13: Deal success...');
    await page.setContent(`
      <div style="
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      ">
        <div style="font-size: 120px; margin-bottom: 20px;">✓</div>
        <div style="font-size: 48px; font-weight: 700; margin-bottom: 20px;">Deal Accepted!</div>
        <div style="font-size: 24px; opacity: 0.9;">The dealer has accepted your offer of $27,500</div>
        <div style="font-size: 20px; margin-top: 30px; opacity: 0.8;">2023 Toyota Camry SE</div>
      </div>
    `);
    await captureFrame(page, 4);

    // Scene 14: End card
    console.log('Scene 14: End card...');
    await page.setContent(`
      <div style="
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: white;
        text-align: center;
      ">
        <div style="font-size: 72px; font-weight: 800; margin-bottom: 20px;">IQ Auto Deals</div>
        <div style="font-size: 32px; margin-bottom: 40px; opacity: 0.9;">Your Trusted Auto Marketplace</div>
        <div style="font-size: 28px; background: white; color: #1e3a8a; padding: 20px 50px; border-radius: 50px; font-weight: 600;">
          Visit iqautodeals.com Today!
        </div>
      </div>
    `);
    await captureFrame(page, 5);

    console.log(`\nCaptured ${frameCount} frames`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }

  // Compile video
  console.log('\nCompiling video with ffmpeg...');
  const outputVideo = path.join(OUTPUT_DIR, 'customer-journey.mp4');
  const ffmpegCommand = `ffmpeg -y -framerate 2 -i "${FRAMES_DIR}/frame_%05d.png" -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -vf "scale=1920:1080" "${outputVideo}"`;

  return new Promise((resolve, reject) => {
    exec(ffmpegCommand, (error) => {
      if (error) {
        console.error('FFmpeg error:', error);
        reject(error);
        return;
      }
      console.log(`\nVideo saved to: ${outputVideo}`);
      exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outputVideo}"`, (err, duration) => {
        if (!err) console.log(`Duration: ${parseFloat(duration).toFixed(1)} seconds`);
        resolve(outputVideo);
      });
    });
  });
}

createCustomerVideo()
  .then(() => console.log('\nCustomer journey video complete!'))
  .catch(console.error);
