const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Marketing Video Storyboard for IQ Auto Deals
const STORYBOARD = [
  {
    name: '01-hero',
    url: 'https://www.iqautodeals.com',
    duration: 4,
    text: 'IQ Auto Deals',
    subtext: 'The Smarter Way to Buy Your Next Car',
    actions: async (page) => {
      await page.waitForSelector('header');
      await new Promise(r => setTimeout(r, 1000));
    }
  },
  {
    name: '02-browse-intro',
    url: 'https://www.iqautodeals.com',
    duration: 3,
    text: 'Browse Thousands of Vehicles',
    subtext: 'From Trusted Dealers Nationwide',
    scrollTo: 500,
    actions: async (page) => {
      await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' }));
      await new Promise(r => setTimeout(r, 1500));
    }
  },
  {
    name: '03-cars-listing',
    url: 'https://www.iqautodeals.com/cars',
    duration: 4,
    text: 'Search by Make, Model & Location',
    subtext: 'Find Your Perfect Match',
    actions: async (page) => {
      await page.waitForSelector('input[placeholder*="Make"]');
      await new Promise(r => setTimeout(r, 1500));
    }
  },
  {
    name: '04-cars-search',
    url: 'https://www.iqautodeals.com/cars',
    duration: 3,
    text: 'Real-Time Inventory',
    subtext: 'Updated Daily from Dealerships',
    actions: async (page) => {
      await page.waitForSelector('input[placeholder*="Make"]');
      await page.type('input[placeholder*="Make"]', 'Toyota', { delay: 100 });
      await new Promise(r => setTimeout(r, 1000));
    }
  },
  {
    name: '05-login-page',
    url: 'https://www.iqautodeals.com/login',
    duration: 3,
    text: 'Quick & Easy Sign Up',
    subtext: 'Create Your Free Account',
    actions: async (page) => {
      await page.waitForSelector('input[type="email"]');
      await new Promise(r => setTimeout(r, 1000));
    }
  },
  {
    name: '06-customer-demo',
    url: 'https://www.iqautodeals.com/login',
    duration: 3,
    text: 'Demo Account Available',
    subtext: 'Try Before You Sign Up',
    actions: async (page) => {
      await page.waitForSelector('button');
      await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }));
      await new Promise(r => setTimeout(r, 1500));
    }
  },
  {
    name: '07-customer-dashboard',
    url: 'https://www.iqautodeals.com/customer',
    duration: 4,
    text: 'Your Personal Dashboard',
    subtext: 'Select Up to 4 Cars to Compare',
    actions: async (page) => {
      // Set demo user in localStorage for customer view
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({
          id: 'demo-customer',
          email: 'demo@customer.com',
          name: 'Demo Customer',
          userType: 'customer'
        }));
      });
      await page.reload({ waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 2500));
    }
  },
  {
    name: '08-select-cars',
    url: null,
    duration: 4,
    text: 'Select Your Favorites',
    subtext: 'Get Competitive Quotes from Dealers',
    actions: async (page) => {
      // Select first two cars by clicking on them
      const cards = await page.$$('.cursor-pointer');
      if (cards.length > 0) {
        await cards[0].click();
        await new Promise(r => setTimeout(r, 1000));
      }
      if (cards.length > 1) {
        await cards[1].click();
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  },
  {
    name: '09-make-deal',
    url: null,
    duration: 4,
    text: 'One Click to Request Deals',
    subtext: 'Dealers Compete for Your Business',
    actions: async (page) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await new Promise(r => setTimeout(r, 2000));
    }
  },
  {
    name: '10-cta',
    url: 'https://www.iqautodeals.com',
    duration: 5,
    text: 'Start Saving Today',
    subtext: 'Visit iqautodeals.com',
    actions: async (page) => {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
];

const OUTPUT_DIR = path.join(__dirname, '../video-output');
const FRAMES_DIR = path.join(OUTPUT_DIR, 'frames');

async function ensureDirectories() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!fs.existsSync(FRAMES_DIR)) fs.mkdirSync(FRAMES_DIR, { recursive: true });

  // Clean frames directory
  const files = fs.readdirSync(FRAMES_DIR);
  for (const file of files) {
    fs.unlinkSync(path.join(FRAMES_DIR, file));
  }
}

async function captureScenes() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: false, // Show browser for better rendering
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  let frameCount = 0;
  const fps = 30;

  for (let i = 0; i < STORYBOARD.length; i++) {
    const scene = STORYBOARD[i];
    console.log(`\nCapturing scene ${i + 1}/${STORYBOARD.length}: ${scene.name}`);

    try {
      // Navigate if URL provided
      if (scene.url) {
        await page.goto(scene.url, { waitUntil: 'networkidle2', timeout: 30000 });
      }

      // Execute scene actions
      if (scene.actions) {
        await scene.actions(page);
      }

      // Capture frames for this scene's duration
      const totalFrames = scene.duration * fps;
      for (let f = 0; f < totalFrames; f++) {
        const framePath = path.join(FRAMES_DIR, `frame_${String(frameCount).padStart(5, '0')}.png`);
        await page.screenshot({ path: framePath, type: 'png' });
        frameCount++;

        if (f % 30 === 0) {
          process.stdout.write(`  Frame ${f}/${totalFrames}\r`);
        }
      }
      console.log(`  Captured ${totalFrames} frames`);
    } catch (error) {
      console.log(`  Warning: Error in scene ${scene.name}: ${error.message}`);
      console.log('  Continuing with next scene...');
    }
  }

  await browser.close();
  console.log(`\nTotal frames captured: ${frameCount}`);
  return frameCount;
}

async function createTextOverlays() {
  console.log('\nCreating text overlay images...');

  for (let i = 0; i < STORYBOARD.length; i++) {
    const scene = STORYBOARD[i];
    if (!scene.text && !scene.subtext) continue;

    const overlayPath = path.join(OUTPUT_DIR, `overlay_${scene.name}.png`);

    // Create overlay using ffmpeg
    const mainText = scene.text || '';
    const subText = scene.subtext || '';

    // Create a transparent overlay with text
    const cmd = `ffmpeg -y -f lavfi -i "color=c=black@0.6:s=1920x200" -vf "drawtext=text='${mainText}':fontsize=72:fontcolor=white:x=(w-text_w)/2:y=40:fontfile=/System/Library/Fonts/Helvetica.ttc,drawtext=text='${subText}':fontsize=36:fontcolor=white:x=(w-text_w)/2:y=130:fontfile=/System/Library/Fonts/Helvetica.ttc" -frames:v 1 "${overlayPath}"`;

    await new Promise((resolve, reject) => {
      exec(cmd, (error) => {
        if (error) {
          console.log(`  Warning: Could not create overlay for ${scene.name}`);
        }
        resolve();
      });
    });
  }
}

async function compileVideo(frameCount) {
  console.log('\nCompiling video from frames...');

  const outputPath = path.join(OUTPUT_DIR, 'iq-auto-deals-marketing.mp4');

  // Compile frames to video
  const compileCmd = `ffmpeg -y -framerate 30 -i "${FRAMES_DIR}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium "${outputPath}"`;

  return new Promise((resolve, reject) => {
    console.log('Running ffmpeg compilation...');
    exec(compileCmd, { maxBuffer: 50 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error('FFmpeg error:', error);
        reject(error);
        return;
      }
      console.log(`Video saved to: ${outputPath}`);
      resolve(outputPath);
    });
  });
}

async function addTextOverlaysToVideo(inputPath) {
  console.log('\nAdding text overlays to video...');

  const outputPath = path.join(OUTPUT_DIR, 'iq-auto-deals-final.mp4');

  // Build complex filter for text overlays
  let filterParts = [];
  let currentTime = 0;

  for (const scene of STORYBOARD) {
    if (scene.text || scene.subtext) {
      const startTime = currentTime;
      const endTime = currentTime + scene.duration;

      const mainText = (scene.text || '').replace(/'/g, "\\'");
      const subText = (scene.subtext || '').replace(/'/g, "\\'");

      if (mainText) {
        filterParts.push(`drawtext=text='${mainText}':fontsize=64:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=h-180:enable='between(t,${startTime},${endTime})'`);
      }
      if (subText) {
        filterParts.push(`drawtext=text='${subText}':fontsize=32:fontcolor=white:borderw=2:bordercolor=black:x=(w-text_w)/2:y=h-100:enable='between(t,${startTime},${endTime})'`);
      }
    }
    currentTime += scene.duration;
  }

  const filterString = filterParts.join(',');

  const cmd = `ffmpeg -y -i "${inputPath}" -vf "${filterString}" -c:v libx264 -crf 18 -preset medium -c:a copy "${outputPath}"`;

  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 50 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error adding overlays:', error.message);
        // Return original if overlay fails
        resolve(inputPath);
        return;
      }
      console.log(`Final video saved to: ${outputPath}`);
      resolve(outputPath);
    });
  });
}

async function downloadBackgroundMusic() {
  console.log('\nNote: For background music, you can add royalty-free music from:');
  console.log('  - YouTube Audio Library (free)');
  console.log('  - Pixabay Music (free)');
  console.log('  - Epidemic Sound (subscription)');
  console.log('\nTo add music later, use:');
  console.log('  ffmpeg -i video.mp4 -i music.mp3 -c:v copy -c:a aac -shortest output.mp4');
}

async function main() {
  console.log('='.repeat(60));
  console.log('IQ Auto Deals - Marketing Video Generator');
  console.log('='.repeat(60));

  try {
    await ensureDirectories();
    const frameCount = await captureScenes();
    const videoPath = await compileVideo(frameCount);
    const finalPath = await addTextOverlaysToVideo(videoPath);
    await downloadBackgroundMusic();

    console.log('\n' + '='.repeat(60));
    console.log('VIDEO GENERATION COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\nOutput location: ${finalPath}`);
    console.log(`\nNext steps:`);
    console.log('1. Review the video in the video-output folder');
    console.log('2. Add background music if desired');
    console.log('3. Upload to YouTube!');
    console.log('\nRecommended YouTube settings:');
    console.log('  - Title: IQ Auto Deals - The Smarter Way to Buy Your Next Car');
    console.log('  - Tags: car buying, auto deals, car shopping, dealership, used cars');
    console.log('  - Category: Autos & Vehicles');

  } catch (error) {
    console.error('Error generating video:', error);
    process.exit(1);
  }
}

main();
