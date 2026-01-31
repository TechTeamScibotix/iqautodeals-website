const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const leadData = {
  name: 'Angela C',
  email: 'ang.stoy@gmail.com',
  phone: '(313) 398-1413',
  phoneArea: 'Detroit, MI',
  userType: 'Customer',
  device: 'iPhone (iOS 18.7, Safari)',
  registeredAt: 'January 31, 2026 at 02:31 AM UTC',
  carsViewed: [
    { year: 2026, make: 'Jeep', model: 'Compass', location: 'Dubuque, IA', views: 3 },
    { year: 2026, make: 'Jeep', model: 'Gladiator', location: 'Dubuque, IA', views: 1 },
    { year: 2020, make: 'Jeep', model: 'Gladiator', location: 'Dubuque, IA', views: 1 },
    { year: 2018, make: 'Jeep', model: 'Grand Cherokee', location: 'Dubuque, IA', views: 3 },
    { year: 2019, make: 'Ram', model: '1500 Classic', location: 'Dubuque, IA', views: 3 },
  ],
  pagesViewed: [
    'Car Financing Guide',
    'For Dealers page',
    'Blog',
    'Privacy Policy',
    'Model pages (Jeep Wrangler, Grand Cherokee, BMW X5, Audi Q5, Lexus RX350)',
    'Location pages (Los Angeles, Atlanta, Houston, San Diego)',
  ],
};

// Calculate Purchase Predictability Score
function calculateScore(lead) {
  let score = 0;
  const factors = [];

  // Viewed multiple specific car detail pages (high intent)
  if (lead.carsViewed.length >= 3) {
    score += 25;
    factors.push({ factor: 'Viewed 5+ specific vehicles', points: '+25' });
  }

  // Registered as a customer (high intent)
  score += 20;
  factors.push({ factor: 'Completed registration', points: '+20' });

  // Viewed same cars multiple times (very interested)
  const repeatViews = lead.carsViewed.filter(c => c.views > 1).length;
  if (repeatViews >= 2) {
    score += 15;
    factors.push({ factor: 'Repeat views on multiple vehicles', points: '+15' });
  }

  // Browsed financing guide (ready to buy)
  if (lead.pagesViewed.some(p => p.toLowerCase().includes('financing'))) {
    score += 15;
    factors.push({ factor: 'Viewed financing guide', points: '+15' });
  }

  // Active session with many page views
  score += 10;
  factors.push({ factor: 'High engagement (many pages viewed)', points: '+10' });

  // Phone number provided
  if (lead.phone) {
    score += 10;
    factors.push({ factor: 'Provided phone number', points: '+10' });
  }

  // Focused on specific brand/type (Jeep/Ram trucks & SUVs)
  const jeepRamCount = lead.carsViewed.filter(c =>
    c.make === 'Jeep' || c.make === 'Ram'
  ).length;
  if (jeepRamCount >= 3) {
    score += 5;
    factors.push({ factor: 'Focused interest (Jeep/Ram vehicles)', points: '+5' });
  }

  return { score: Math.min(score, 100), factors };
}

const { score, factors } = calculateScore(leadData);

function getScoreColor(score) {
  if (score >= 80) return '#22c55e'; // green
  if (score >= 60) return '#f59e0b'; // amber
  if (score >= 40) return '#f97316'; // orange
  return '#ef4444'; // red
}

function getScoreLabel(score) {
  if (score >= 80) return 'HOT LEAD';
  if (score >= 60) return 'WARM LEAD';
  if (score >= 40) return 'MODERATE';
  return 'COLD';
}

const scoreColor = getScoreColor(score);
const scoreLabel = getScoreLabel(score);

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      color: #1f2937;
      background: #fff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #1e40af;
    }
    .logo-section h1 {
      font-size: 28px;
      color: #1e40af;
      margin-bottom: 5px;
    }
    .logo-section p {
      color: #6b7280;
      font-size: 14px;
    }
    .report-info {
      text-align: right;
      font-size: 12px;
      color: #6b7280;
    }
    .score-section {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      gap: 40px;
    }
    .score-circle {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: conic-gradient(${scoreColor} ${score * 3.6}deg, #374151 0deg);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .score-inner {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      background: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .score-number {
      font-size: 42px;
      font-weight: 700;
      color: ${scoreColor};
    }
    .score-label {
      font-size: 11px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .score-details h2 {
      color: #fff;
      font-size: 24px;
      margin-bottom: 5px;
    }
    .score-badge {
      display: inline-block;
      background: ${scoreColor};
      color: #fff;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    .score-factors {
      color: #d1d5db;
      font-size: 13px;
    }
    .score-factors div {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid #374151;
    }
    .score-factors span:last-child {
      color: ${scoreColor};
      font-weight: 600;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .info-item {
      background: #f9fafb;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #1e40af;
    }
    .info-item label {
      font-size: 11px;
      text-transform: uppercase;
      color: #6b7280;
      letter-spacing: 0.5px;
    }
    .info-item p {
      font-size: 16px;
      font-weight: 500;
      margin-top: 4px;
    }
    .cars-table {
      width: 100%;
      border-collapse: collapse;
    }
    .cars-table th {
      background: #1e40af;
      color: #fff;
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
    }
    .cars-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .cars-table tr:nth-child(even) {
      background: #f9fafb;
    }
    .views-badge {
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .activity-list {
      list-style: none;
    }
    .activity-list li {
      padding: 10px 15px;
      background: #f9fafb;
      margin-bottom: 8px;
      border-radius: 6px;
      font-size: 14px;
      border-left: 3px solid #10b981;
    }
    .recommendation {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border: 2px solid #10b981;
      border-radius: 12px;
      padding: 20px;
      margin-top: 20px;
    }
    .recommendation h3 {
      color: #065f46;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .recommendation p {
      color: #047857;
      font-size: 14px;
      line-height: 1.6;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #9ca3af;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-section">
      <h1>IQ Auto Deals</h1>
      <p>Lead Intelligence Report</p>
    </div>
    <div class="report-info">
      <p>Report Generated</p>
      <p><strong>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong></p>
    </div>
  </div>

  <div class="score-section">
    <div class="score-circle">
      <div class="score-inner">
        <div class="score-number">${score}</div>
        <div class="score-label">Score</div>
      </div>
    </div>
    <div class="score-details">
      <h2>Purchase Predictability</h2>
      <div class="score-badge">${scoreLabel}</div>
      <div class="score-factors">
        ${factors.map(f => `<div><span>${f.factor}</span><span>${f.points}</span></div>`).join('')}
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Lead Information</div>
    <div class="info-grid">
      <div class="info-item">
        <label>Full Name</label>
        <p>${leadData.name}</p>
      </div>
      <div class="info-item">
        <label>Email Address</label>
        <p>${leadData.email}</p>
      </div>
      <div class="info-item">
        <label>Phone Number</label>
        <p>${leadData.phone}</p>
      </div>
      <div class="info-item">
        <label>Phone Area</label>
        <p>${leadData.phoneArea}</p>
      </div>
      <div class="info-item">
        <label>Account Type</label>
        <p>${leadData.userType}</p>
      </div>
      <div class="info-item">
        <label>Device</label>
        <p>${leadData.device}</p>
      </div>
      <div class="info-item" style="grid-column: span 2;">
        <label>Registration Date</label>
        <p>${leadData.registeredAt}</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Vehicles Viewed</div>
    <table class="cars-table">
      <thead>
        <tr>
          <th>Year</th>
          <th>Make</th>
          <th>Model</th>
          <th>Location</th>
          <th>Views</th>
        </tr>
      </thead>
      <tbody>
        ${leadData.carsViewed.map(car => `
          <tr>
            <td>${car.year}</td>
            <td>${car.make}</td>
            <td>${car.model}</td>
            <td>${car.location}</td>
            <td><span class="views-badge">${car.views}x</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Session Activity</div>
    <ul class="activity-list">
      ${leadData.pagesViewed.map(page => `<li>${page}</li>`).join('')}
    </ul>
  </div>

  <div class="recommendation">
    <h3>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#065f46" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      Recommended Action
    </h3>
    <p>
      <strong>High-priority follow-up recommended.</strong> This lead shows strong buying signals:
      multiple repeat views on specific vehicles, completed registration with phone number,
      and reviewed financing options. Focus on <strong>Jeep Compass, Grand Cherokee, and Ram 1500</strong>
      from Dubuque, IA inventory. Lead is from Detroit, MI area - may be relocating or willing to travel for the right deal.
      Contact within 24 hours for best conversion opportunity.
    </p>
  </div>

  <div class="footer">
    <p>IQ Auto Deals - Smart Car Buying Made Simple | iqautodeals.com | Confidential Lead Report</p>
  </div>
</body>
</html>
`;

async function generatePDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const outputPath = path.join(process.env.HOME, 'Downloads', 'Lead-Report-Angela-C.pdf');

  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });

  await browser.close();

  console.log(`PDF generated: ${outputPath}`);
}

generatePDF().catch(console.error);
