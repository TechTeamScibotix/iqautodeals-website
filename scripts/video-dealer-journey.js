const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://iqautodeals.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'video-output');
const FRAMES_DIR = path.join(OUTPUT_DIR, 'dealer-frames');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
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
      position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(135deg, rgba(21, 128, 61, 0.95), rgba(34, 197, 94, 0.95));
      color: white; padding: 18px 36px; border-radius: 14px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 999999; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      border: 2px solid rgba(255,255,255,0.2); max-width: 85%;
    `;
    overlay.innerHTML = `
      <div style="font-size: 26px; font-weight: 700; margin-bottom: ${subtext ? '6px' : '0'};">${text}</div>
      ${subtext ? `<div style="font-size: 16px; opacity: 0.9;">${subtext}</div>` : ''}
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

async function createDealerVideo() {
  console.log('Starting Dealer Journey Video...\n');

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Scene 1: Dealer intro
    console.log('Scene 1: Intro...');
    await page.setContent(`
      <div style="width:100vw;height:100vh;background:linear-gradient(135deg,#15803d 0%,#22c55e 50%,#15803d 100%);display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:white;text-align:center;">
        <div style="font-size:64px;font-weight:800;margin-bottom:20px;">IQ Auto Deals</div>
        <div style="font-size:38px;margin-bottom:15px;">For Dealers</div>
        <div style="font-size:24px;opacity:0.9;">Grow Your Business With Our Platform</div>
      </div>
    `);
    await captureFrame(page, 4);

    // Scene 2: Homepage
    console.log('Scene 2: Homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    await addTextOverlay(page, 'Welcome to IQ Auto Deals', 'The premier platform for auto dealers');
    await captureFrame(page, 3);
    await removeOverlay(page);

    // Scene 3: Dealer Integration page
    console.log('Scene 3: Dealer Integration...');
    await page.goto(`${BASE_URL}/dealer-integration`, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    await addTextOverlay(page, 'Built for Dealers', 'Powerful tools to grow your dealership');
    await captureFrame(page, 3);
    await removeOverlay(page);
    await smoothScroll(page, 500, 10);
    await captureFrame(page, 2);

    // Scene 4: Login
    console.log('Scene 4: Dealer Login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 1500));
    await addTextOverlay(page, 'Secure Dealer Portal', 'Access your dashboard anytime');
    await captureFrame(page, 3);
    await removeOverlay(page);

    const emailInput = await page.$('input[type="email"], input[name="email"]');
    const passwordInput = await page.$('input[type="password"], input[name="password"]');
    if (emailInput && passwordInput) {
      await emailInput.type('dealer@automax.com', { delay: 40 });
      await captureFrame(page, 1);
      await passwordInput.type('password123', { delay: 40 });
      await captureFrame(page, 1);
    }

    // Scene 5: Full Dealer Dashboard with rich data
    console.log('Scene 5: Dealer Dashboard...');
    await page.setContent(`
      <div style="width:100vw;height:100vh;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:30px;box-sizing:border-box;overflow:hidden;">
        <div style="max-width:1400px;margin:0 auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;">
            <div>
              <h1 style="font-size:32px;color:#1e293b;margin:0;">AutoMax Dealership</h1>
              <p style="color:#64748b;margin:5px 0 0 0;">Welcome back, David Anderson</p>
            </div>
            <div style="display:flex;gap:15px;align-items:center;">
              <div style="background:#fef3c7;color:#d97706;padding:8px 16px;border-radius:8px;font-weight:600;">3 Pending Offers</div>
              <div style="background:#22c55e;color:white;padding:10px 20px;border-radius:8px;font-weight:600;">+ Add New Car</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:15px;margin-bottom:25px;">
            <div style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:white;border-radius:14px;padding:20px;">
              <div style="font-size:13px;opacity:0.9;">Total Inventory</div>
              <div style="font-size:36px;font-weight:700;">52</div>
              <div style="font-size:12px;opacity:0.8;margin-top:5px;">+8 this month</div>
            </div>
            <div style="background:linear-gradient(135deg,#22c55e,#15803d);color:white;border-radius:14px;padding:20px;">
              <div style="font-size:13px;opacity:0.9;">Active Deals</div>
              <div style="font-size:36px;font-weight:700;">18</div>
              <div style="font-size:12px;opacity:0.8;margin-top:5px;">5 closing soon</div>
            </div>
            <div style="background:linear-gradient(135deg,#f59e0b,#d97706);color:white;border-radius:14px;padding:20px;">
              <div style="font-size:13px;opacity:0.9;">Monthly Revenue</div>
              <div style="font-size:36px;font-weight:700;">$847K</div>
              <div style="font-size:12px;opacity:0.8;margin-top:5px;">+23% vs last month</div>
            </div>
            <div style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:white;border-radius:14px;padding:20px;">
              <div style="font-size:13px;opacity:0.9;">Views This Week</div>
              <div style="font-size:36px;font-weight:700;">4.2K</div>
              <div style="font-size:12px;opacity:0.8;margin-top:5px;">+340 today</div>
            </div>
            <div style="background:linear-gradient(135deg,#ec4899,#be185d);color:white;border-radius:14px;padding:20px;">
              <div style="font-size:13px;opacity:0.9;">Conversion Rate</div>
              <div style="font-size:36px;font-weight:700;">34%</div>
              <div style="font-size:12px;opacity:0.8;margin-top:5px;">+5% improvement</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;">
            <div style="background:white;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                <h2 style="font-size:18px;color:#1e293b;margin:0;">Recent Activity</h2>
                <span style="color:#3b82f6;font-size:14px;cursor:pointer;">View All</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f8fafc;border-radius:10px;border-left:4px solid #22c55e;">
                  <div><span style="font-weight:600;color:#1e293b;">New Offer Received</span><br><span style="color:#64748b;font-size:13px;">2023 BMW X5 M50i - $68,500 offer from Michael T.</span></div>
                  <span style="color:#22c55e;font-weight:600;font-size:13px;">Just now</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f8fafc;border-radius:10px;border-left:4px solid #3b82f6;">
                  <div><span style="font-weight:600;color:#1e293b;">Deal Accepted</span><br><span style="color:#64748b;font-size:13px;">2022 Honda Accord Touring - Sold for $31,200</span></div>
                  <span style="color:#3b82f6;font-weight:600;font-size:13px;">2 hours ago</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f8fafc;border-radius:10px;border-left:4px solid #f59e0b;">
                  <div><span style="font-weight:600;color:#1e293b;">Counter Offer Sent</span><br><span style="color:#64748b;font-size:13px;">2023 Toyota Camry SE - Counter: $28,000</span></div>
                  <span style="color:#f59e0b;font-weight:600;font-size:13px;">4 hours ago</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f8fafc;border-radius:10px;border-left:4px solid #8b5cf6;">
                  <div><span style="font-weight:600;color:#1e293b;">New Listing Published</span><br><span style="color:#64748b;font-size:13px;">2024 Mercedes-Benz GLE 450 - Listed at $72,900</span></div>
                  <span style="color:#8b5cf6;font-weight:600;font-size:13px;">Yesterday</span>
                </div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <h2 style="font-size:18px;color:#1e293b;margin:0 0 15px 0;">Quick Stats</h2>
              <div style="display:flex;flex-direction:column;gap:15px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="color:#64748b;">Avg. Days on Lot</span>
                  <span style="font-weight:700;color:#1e293b;">18 days</span>
                </div>
                <div style="height:1px;background:#e2e8f0;"></div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="color:#64748b;">Avg. Sale Price</span>
                  <span style="font-weight:700;color:#1e293b;">$42,350</span>
                </div>
                <div style="height:1px;background:#e2e8f0;"></div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="color:#64748b;">Total Sales (Dec)</span>
                  <span style="font-weight:700;color:#1e293b;">23 vehicles</span>
                </div>
                <div style="height:1px;background:#e2e8f0;"></div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="color:#64748b;">Customer Rating</span>
                  <span style="font-weight:700;color:#f59e0b;">★ 4.8/5.0</span>
                </div>
                <div style="height:1px;background:#e2e8f0;"></div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="color:#64748b;">Response Time</span>
                  <span style="font-weight:700;color:#22c55e;">< 2 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
    await addTextOverlay(page, 'Your Dealer Dashboard', 'Real-time insights at a glance');
    await captureFrame(page, 5);
    await removeOverlay(page);

    // Scene 6: Full Inventory Management
    console.log('Scene 6: Inventory Management...');
    await page.setContent(`
      <div style="width:100vw;height:100vh;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:30px;box-sizing:border-box;overflow:hidden;">
        <div style="max-width:1400px;margin:0 auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;">
            <div>
              <h1 style="font-size:28px;color:#1e293b;margin:0;">Inventory Management</h1>
              <p style="color:#64748b;margin:5px 0 0 0;">52 vehicles in stock</p>
            </div>
            <div style="display:flex;gap:12px;">
              <input type="text" placeholder="Search inventory..." style="padding:10px 16px;border:1px solid #e2e8f0;border-radius:8px;width:250px;font-size:14px;">
              <select style="padding:10px 16px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;background:white;">
                <option>All Makes</option><option>Toyota</option><option>Honda</option><option>BMW</option>
              </select>
              <button style="background:#22c55e;color:white;border:none;padding:10px 20px;border-radius:8px;font-weight:600;cursor:pointer;">+ Add New Car</button>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;">
            <div style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <div style="height:140px;position:relative;background:#f1f5f9;">
                <img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/4t1g11ak8pu123001-verified-P8BUyEDVewS8Mpac8pa1Qu0ZWufRDa.jpg" style="width:100%;height:100%;object-fit:cover;">
                <span style="position:absolute;top:10px;right:10px;background:#8b5cf6;color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;">SAMPLE</span>
              </div>
              <div style="padding:16px;text-align:center;">
                <div style="font-size:16px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                <div style="color:#64748b;font-size:13px;margin-top:8px;">Upload photos & details</div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <div style="height:140px;position:relative;background:#f1f5f9;">
                <img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/1hgcv1f92na123002-verified-gStfeAnXwn3oosMabY7PNRIvySyOsj.jpg" style="width:100%;height:100%;object-fit:cover;">
                <span style="position:absolute;top:10px;right:10px;background:#8b5cf6;color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;">SAMPLE</span>
              </div>
              <div style="padding:16px;text-align:center;">
                <div style="font-size:16px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                <div style="color:#64748b;font-size:13px;margin-top:8px;">Upload photos & details</div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <div style="height:140px;position:relative;background:#f1f5f9;">
                <img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/5uxcr6c03p9k44002-verified-oueW8nlJqqhIawtxxGwCehcfNsZYh9.jpg" style="width:100%;height:100%;object-fit:cover;">
                <span style="position:absolute;top:10px;right:10px;background:#8b5cf6;color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;">SAMPLE</span>
              </div>
              <div style="padding:16px;text-align:center;">
                <div style="font-size:16px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                <div style="color:#64748b;font-size:13px;margin-top:8px;">Upload photos & details</div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <div style="height:140px;position:relative;background:#f1f5f9;">
                <img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/4jgfb4kb9pa44003-verified-P711T8dfDOdzMCM5RadJFcL8jFb7gd.jpg" style="width:100%;height:100%;object-fit:cover;">
                <span style="position:absolute;top:10px;right:10px;background:#8b5cf6;color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;">SAMPLE</span>
              </div>
              <div style="padding:16px;text-align:center;">
                <div style="font-size:16px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                <div style="color:#64748b;font-size:13px;margin-top:8px;">Upload photos & details</div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <div style="height:140px;position:relative;background:#f1f5f9;">
                <img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/wa1lhbf79nd44004-verified-DLaA6YnIL3alEWnNOyPu5PXBKtZzFH.jpg" style="width:100%;height:100%;object-fit:cover;">
                <span style="position:absolute;top:10px;right:10px;background:#8b5cf6;color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;">SAMPLE</span>
              </div>
              <div style="padding:16px;text-align:center;">
                <div style="font-size:16px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                <div style="color:#64748b;font-size:13px;margin-top:8px;">Upload photos & details</div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <div style="height:140px;position:relative;background:#f1f5f9;">
                <img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/5ux53dp08p9223005-verified-uIgvMhOqnZEYF3L05U4goaQzOPzxMX.jpg" style="width:100%;height:100%;object-fit:cover;">
                <span style="position:absolute;top:10px;right:10px;background:#8b5cf6;color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;">SAMPLE</span>
              </div>
              <div style="padding:16px;text-align:center;">
                <div style="font-size:16px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                <div style="color:#64748b;font-size:13px;margin-top:8px;">Upload photos & details</div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <div style="height:140px;position:relative;background:#f1f5f9;">
                <img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/jtmb1rfv4pd223001-verified-qDErYYnm9tK9bY9wulxGpHH74NfG8Q.jpg" style="width:100%;height:100%;object-fit:cover;">
                <span style="position:absolute;top:10px;right:10px;background:#8b5cf6;color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;">SAMPLE</span>
              </div>
              <div style="padding:16px;text-align:center;">
                <div style="font-size:16px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                <div style="color:#64748b;font-size:13px;margin-top:8px;">Upload photos & details</div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <div style="height:140px;position:relative;background:#f1f5f9;">
                <img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/wa1bvafy9n2223006-verified-Tmx3Id2DDUu88NaUrcMi0MbeP2ipIt.jpg" style="width:100%;height:100%;object-fit:cover;">
                <span style="position:absolute;top:10px;right:10px;background:#8b5cf6;color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;">SAMPLE</span>
              </div>
              <div style="padding:16px;text-align:center;">
                <div style="font-size:16px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                <div style="color:#64748b;font-size:13px;margin-top:8px;">Upload photos & details</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
    await addTextOverlay(page, 'Manage Your Inventory', '52 vehicles with real-time status tracking');
    await captureFrame(page, 5);
    await removeOverlay(page);

    // Scene 7: Incoming Deals Management
    console.log('Scene 7: Deal Management...');
    await page.setContent(`
      <div style="width:100vw;height:100vh;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:30px;box-sizing:border-box;overflow:hidden;">
        <div style="max-width:1400px;margin:0 auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;">
            <div>
              <h1 style="font-size:28px;color:#1e293b;margin:0;">Incoming Deals</h1>
              <p style="color:#64748b;margin:5px 0 0 0;">18 active negotiations</p>
            </div>
            <div style="display:flex;gap:10px;">
              <div style="background:#dcfce7;color:#15803d;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;">5 New Today</div>
              <div style="background:#fef3c7;color:#d97706;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;">3 Awaiting Response</div>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:15px;">
            <div style="background:white;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);border-left:5px solid #22c55e;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:15px;">
                    <div style="width:100px;height:70px;border-radius:8px;overflow:hidden;position:relative;"><img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/4t1g11ak8pu123001-verified-P8BUyEDVewS8Mpac8pa1Qu0ZWufRDa.jpg" style="width:100%;height:100%;object-fit:cover;"><span style="position:absolute;top:5px;right:5px;background:#8b5cf6;color:white;padding:2px 6px;border-radius:10px;font-size:9px;font-weight:600;">SAMPLE</span></div>
                    <div>
                      <div style="font-size:18px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                      <div style="color:#64748b;font-size:13px;margin-top:3px;">Receive offers from verified buyers</div>
                    </div>
                  </div>
                </div>
                <div style="text-align:right;margin-right:20px;">
                  <div style="font-size:14px;color:#1e293b;font-weight:600;">Blake Buckhannan</div>
                  <div style="color:#64748b;font-size:12px;">Birmingham, AL • Verified Buyer</div>
                  <div style="color:#22c55e;font-size:11px;margin-top:3px;">Pre-approved financing</div>
                </div>
                <div style="display:flex;gap:10px;">
                  <button style="background:#22c55e;color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Accept</button>
                  <button style="background:#3b82f6;color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Counter</button>
                  <button style="background:#f1f5f9;color:#64748b;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Decline</button>
                </div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);border-left:5px solid #f59e0b;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:15px;">
                    <div style="width:100px;height:70px;border-radius:8px;overflow:hidden;position:relative;"><img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/5uxcr6c03p9k44002-verified-oueW8nlJqqhIawtxxGwCehcfNsZYh9.jpg" style="width:100%;height:100%;object-fit:cover;"><span style="position:absolute;top:5px;right:5px;background:#8b5cf6;color:white;padding:2px 6px;border-radius:10px;font-size:9px;font-weight:600;">SAMPLE</span></div>
                    <div>
                      <div style="font-size:18px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                      <div style="color:#64748b;font-size:13px;margin-top:3px;">Receive offers from verified buyers</div>
                    </div>
                  </div>
                </div>
                <div style="text-align:right;margin-right:20px;">
                  <div style="font-size:14px;color:#1e293b;font-weight:600;">Michael Thompson</div>
                  <div style="color:#64748b;font-size:12px;">Atlanta, GA • Verified Buyer</div>
                  <div style="color:#3b82f6;font-size:11px;margin-top:3px;">Cash buyer</div>
                </div>
                <div style="display:flex;gap:10px;">
                  <button style="background:#22c55e;color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Accept</button>
                  <button style="background:#3b82f6;color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Counter</button>
                  <button style="background:#f1f5f9;color:#64748b;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Decline</button>
                </div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);border-left:5px solid #3b82f6;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:15px;">
                    <div style="width:100px;height:70px;border-radius:8px;overflow:hidden;position:relative;"><img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/1hgcv1f92na123002-verified-gStfeAnXwn3oosMabY7PNRIvySyOsj.jpg" style="width:100%;height:100%;object-fit:cover;"><span style="position:absolute;top:5px;right:5px;background:#8b5cf6;color:white;padding:2px 6px;border-radius:10px;font-size:9px;font-weight:600;">SAMPLE</span></div>
                    <div>
                      <div style="font-size:18px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                      <div style="color:#64748b;font-size:13px;margin-top:3px;">Receive offers from verified buyers</div>
                    </div>
                  </div>
                </div>
                <div style="text-align:right;margin-right:20px;">
                  <div style="font-size:14px;color:#1e293b;font-weight:600;">Alexis Wostl</div>
                  <div style="color:#64748b;font-size:12px;">Nashville, TN • Verified Buyer</div>
                  <div style="color:#22c55e;font-size:11px;margin-top:3px;">Trade-in included</div>
                </div>
                <div style="display:flex;gap:10px;">
                  <button style="background:#22c55e;color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Accept</button>
                  <button style="background:#3b82f6;color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Counter</button>
                  <button style="background:#f1f5f9;color:#64748b;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Decline</button>
                </div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);border-left:5px solid #8b5cf6;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:15px;">
                    <div style="width:100px;height:70px;border-radius:8px;overflow:hidden;position:relative;"><img src="https://yzkbvk1txue5y0ml.public.blob.vercel-storage.com/cars/4jgfb4kb9pa44003-verified-P711T8dfDOdzMCM5RadJFcL8jFb7gd.jpg" style="width:100%;height:100%;object-fit:cover;"><span style="position:absolute;top:5px;right:5px;background:#8b5cf6;color:white;padding:2px 6px;border-radius:10px;font-size:9px;font-weight:600;">SAMPLE</span></div>
                    <div>
                      <div style="font-size:18px;font-weight:600;color:#1e293b;">List Your Vehicle Today</div>
                      <div style="color:#64748b;font-size:13px;margin-top:3px;">Receive offers from verified buyers</div>
                    </div>
                  </div>
                </div>
                <div style="text-align:right;margin-right:20px;">
                  <div style="font-size:14px;color:#1e293b;font-weight:600;">Jennifer Davis</div>
                  <div style="color:#64748b;font-size:12px;">Charlotte, NC • Verified Buyer</div>
                  <div style="color:#22c55e;font-size:11px;margin-top:3px;">Pre-approved $70K</div>
                </div>
                <div style="display:flex;gap:10px;">
                  <button style="background:#22c55e;color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Accept</button>
                  <button style="background:#3b82f6;color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Counter</button>
                  <button style="background:#f1f5f9;color:#64748b;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Decline</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
    await addTextOverlay(page, 'Manage Incoming Deals', 'Accept, counter, or negotiate in real-time');
    await captureFrame(page, 5);
    await removeOverlay(page);

    // Scene 8: Full Analytics Dashboard
    console.log('Scene 8: Analytics Dashboard...');
    await page.setContent(`
      <div style="width:100vw;height:100vh;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:30px;box-sizing:border-box;overflow:hidden;">
        <div style="max-width:1400px;margin:0 auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <div>
              <h1 style="font-size:28px;color:#1e293b;margin:0;">Sales Analytics</h1>
              <p style="color:#64748b;margin:5px 0 0 0;">December 2025 Performance</p>
            </div>
            <div style="display:flex;gap:10px;">
              <select style="padding:8px 16px;border:1px solid #e2e8f0;border-radius:8px;background:white;">
                <option>Last 30 Days</option><option>Last 90 Days</option><option>This Year</option>
              </select>
              <button style="background:#3b82f6;color:white;border:none;padding:8px 16px;border-radius:8px;font-weight:600;">Export Report</button>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px;">
            <div style="background:white;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <h2 style="font-size:16px;color:#1e293b;margin:0 0 15px 0;">Monthly Revenue Trend</h2>
              <div style="display:flex;align-items:flex-end;gap:8px;height:180px;padding-bottom:25px;border-bottom:1px solid #e2e8f0;">
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                  <div style="width:100%;background:#e2e8f0;border-radius:6px 6px 0 0;height:45%;"></div>
                  <span style="font-size:11px;color:#64748b;margin-top:8px;">Jul</span>
                  <span style="font-size:10px;color:#94a3b8;">$412K</span>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                  <div style="width:100%;background:#e2e8f0;border-radius:6px 6px 0 0;height:62%;"></div>
                  <span style="font-size:11px;color:#64748b;margin-top:8px;">Aug</span>
                  <span style="font-size:10px;color:#94a3b8;">$534K</span>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                  <div style="width:100%;background:#e2e8f0;border-radius:6px 6px 0 0;height:48%;"></div>
                  <span style="font-size:11px;color:#64748b;margin-top:8px;">Sep</span>
                  <span style="font-size:10px;color:#94a3b8;">$445K</span>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                  <div style="width:100%;background:#3b82f6;border-radius:6px 6px 0 0;height:78%;"></div>
                  <span style="font-size:11px;color:#64748b;margin-top:8px;">Oct</span>
                  <span style="font-size:10px;color:#94a3b8;">$687K</span>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                  <div style="width:100%;background:#3b82f6;border-radius:6px 6px 0 0;height:68%;"></div>
                  <span style="font-size:11px;color:#64748b;margin-top:8px;">Nov</span>
                  <span style="font-size:10px;color:#94a3b8;">$589K</span>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                  <div style="width:100%;background:#22c55e;border-radius:6px 6px 0 0;height:100%;"></div>
                  <span style="font-size:11px;color:#64748b;margin-top:8px;">Dec</span>
                  <span style="font-size:10px;color:#22c55e;font-weight:600;">$847K</span>
                </div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <h2 style="font-size:16px;color:#1e293b;margin:0 0 15px 0;">Sales by Category</h2>
              <div style="display:flex;flex-direction:column;gap:12px;">
                <div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="color:#64748b;font-size:13px;">SUVs</span>
                    <span style="font-weight:600;color:#1e293b;">42%</span>
                  </div>
                  <div style="height:8px;background:#e2e8f0;border-radius:4px;">
                    <div style="height:100%;width:42%;background:#3b82f6;border-radius:4px;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="color:#64748b;font-size:13px;">Sedans</span>
                    <span style="font-weight:600;color:#1e293b;">31%</span>
                  </div>
                  <div style="height:8px;background:#e2e8f0;border-radius:4px;">
                    <div style="height:100%;width:31%;background:#22c55e;border-radius:4px;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="color:#64748b;font-size:13px;">Trucks</span>
                    <span style="font-weight:600;color:#1e293b;">18%</span>
                  </div>
                  <div style="height:8px;background:#e2e8f0;border-radius:4px;">
                    <div style="height:100%;width:18%;background:#f59e0b;border-radius:4px;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="color:#64748b;font-size:13px;">Electric</span>
                    <span style="font-weight:600;color:#1e293b;">9%</span>
                  </div>
                  <div style="height:8px;background:#e2e8f0;border-radius:4px;">
                    <div style="height:100%;width:9%;background:#8b5cf6;border-radius:4px;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
            <div style="background:white;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <h2 style="font-size:16px;color:#1e293b;margin:0 0 15px 0;">Top Selling Models</h2>
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;">
                  <div><span style="color:#1e293b;font-weight:500;">Toyota Camry</span></div>
                  <div style="text-align:right;"><span style="font-weight:700;color:#22c55e;">23</span><span style="color:#64748b;font-size:12px;"> sold</span></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;">
                  <div><span style="color:#1e293b;font-weight:500;">Honda Accord</span></div>
                  <div style="text-align:right;"><span style="font-weight:700;color:#22c55e;">18</span><span style="color:#64748b;font-size:12px;"> sold</span></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;">
                  <div><span style="color:#1e293b;font-weight:500;">BMW X5</span></div>
                  <div style="text-align:right;"><span style="font-weight:700;color:#22c55e;">12</span><span style="color:#64748b;font-size:12px;"> sold</span></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;">
                  <div><span style="color:#1e293b;font-weight:500;">Ford F-150</span></div>
                  <div style="text-align:right;"><span style="font-weight:700;color:#22c55e;">11</span><span style="color:#64748b;font-size:12px;"> sold</span></div>
                </div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <h2 style="font-size:16px;color:#1e293b;margin:0 0 15px 0;">Customer Sources</h2>
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;">
                  <div><span style="color:#1e293b;font-weight:500;">IQ Auto Deals</span></div>
                  <div><span style="font-weight:700;color:#3b82f6;">67%</span></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;">
                  <div><span style="color:#1e293b;font-weight:500;">Direct/Walk-in</span></div>
                  <div><span style="font-weight:700;color:#3b82f6;">18%</span></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;">
                  <div><span style="color:#1e293b;font-weight:500;">Referrals</span></div>
                  <div><span style="font-weight:700;color:#3b82f6;">10%</span></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;">
                  <div><span style="color:#1e293b;font-weight:500;">Other</span></div>
                  <div><span style="font-weight:700;color:#3b82f6;">5%</span></div>
                </div>
              </div>
            </div>

            <div style="background:white;border-radius:14px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
              <h2 style="font-size:16px;color:#1e293b;margin:0 0 15px 0;">Key Metrics</h2>
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;">
                  <div><span style="color:#64748b;">Avg. Sale Price</span></div>
                  <div><span style="font-weight:700;color:#1e293b;">$42,350</span></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;">
                  <div><span style="color:#64748b;">Avg. Profit Margin</span></div>
                  <div><span style="font-weight:700;color:#22c55e;">12.4%</span></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;">
                  <div><span style="color:#64748b;">Avg. Days to Sell</span></div>
                  <div><span style="font-weight:700;color:#1e293b;">18 days</span></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;">
                  <div><span style="color:#64748b;">Deal Close Rate</span></div>
                  <div><span style="font-weight:700;color:#22c55e;">34%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
    await addTextOverlay(page, 'Comprehensive Analytics', 'Track every metric that matters');
    await captureFrame(page, 5);
    await removeOverlay(page);

    // Scene 9: Benefits
    console.log('Scene 9: Benefits...');
    await page.setContent(`
      <div style="width:100vw;height:100vh;background:linear-gradient(135deg,#15803d 0%,#22c55e 100%);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
        <div style="font-size:44px;font-weight:700;margin-bottom:60px;">Why Dealers Choose IQ Auto Deals</div>
        <div style="display:flex;gap:60px;">
          <div style="text-align:center;">
            <div style="width:80px;height:80px;background:rgba(255,255,255,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:2px solid rgba(255,255,255,0.3);">
              <svg width="36" height="36" fill="white" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
            </div>
            <div style="font-size:22px;font-weight:600;">Easy Listings</div>
            <div style="font-size:14px;opacity:0.85;margin-top:8px;">List vehicles in minutes</div>
          </div>
          <div style="text-align:center;">
            <div style="width:80px;height:80px;background:rgba(255,255,255,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:2px solid rgba(255,255,255,0.3);">
              <svg width="36" height="36" fill="white" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
            </div>
            <div style="font-size:22px;font-weight:600;">More Sales</div>
            <div style="font-size:14px;opacity:0.85;margin-top:8px;">Reach buyers nationwide</div>
          </div>
          <div style="text-align:center;">
            <div style="width:80px;height:80px;background:rgba(255,255,255,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:2px solid rgba(255,255,255,0.3);">
              <svg width="36" height="36" fill="white" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
            </div>
            <div style="font-size:22px;font-weight:600;">Smart Analytics</div>
            <div style="font-size:14px;opacity:0.85;margin-top:8px;">Data-driven insights</div>
          </div>
          <div style="text-align:center;">
            <div style="width:80px;height:80px;background:rgba(255,255,255,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:2px solid rgba(255,255,255,0.3);">
              <svg width="36" height="36" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </div>
            <div style="font-size:22px;font-weight:600;">Direct Deals</div>
            <div style="font-size:14px;opacity:0.85;margin-top:8px;">No middleman fees</div>
          </div>
        </div>
      </div>
    `);
    await captureFrame(page, 4);

    // Scene 10: End card
    console.log('Scene 10: End card...');
    await page.setContent(`
      <div style="width:100vw;height:100vh;background:linear-gradient(135deg,#15803d 0%,#22c55e 50%,#15803d 100%);display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:white;text-align:center;">
        <div style="font-size:68px;font-weight:800;margin-bottom:20px;">IQ Auto Deals</div>
        <div style="font-size:30px;margin-bottom:40px;opacity:0.9;">Partner With Us Today</div>
        <div style="font-size:26px;background:white;color:#15803d;padding:18px 45px;border-radius:50px;font-weight:600;">iqautodeals.com/dealer-integration</div>
      </div>
    `);
    await captureFrame(page, 5);

    console.log(`\nCaptured ${frameCount} frames`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }

  console.log('\nCompiling video with ffmpeg...');
  const outputVideo = path.join(OUTPUT_DIR, 'dealer-journey.mp4');
  const ffmpegCommand = `ffmpeg -y -framerate 2 -i "${FRAMES_DIR}/frame_%05d.png" -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -vf "scale=1920:1080" "${outputVideo}"`;

  return new Promise((resolve, reject) => {
    exec(ffmpegCommand, (error) => {
      if (error) { console.error('FFmpeg error:', error); reject(error); return; }
      console.log(`\nVideo saved to: ${outputVideo}`);
      exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outputVideo}"`, (err, duration) => {
        if (!err) console.log(`Duration: ${parseFloat(duration).toFixed(1)} seconds`);
        resolve(outputVideo);
      });
    });
  });
}

createDealerVideo().then(() => console.log('\nDealer journey video complete!')).catch(console.error);
