const fs = require('fs');
const https = require('https');
const http = require('http');

// Read the CSV file
const csvFile = process.argv[2] || 'georgia-car-dealers-2025-12-18.csv';

if (!fs.existsSync(csvFile)) {
  console.error(`File not found: ${csvFile}`);
  process.exit(1);
}

const csvContent = fs.readFileSync(csvFile, 'utf-8');
const lines = csvContent.split('\n');
const header = lines[0];
const dealers = [];

// Parse CSV
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  // Parse CSV line (handling quoted fields)
  const fields = [];
  let field = '';
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(field.replace(/^"|"$/g, '').replace(/""/g, '"'));
      field = '';
    } else {
      field += char;
    }
  }
  fields.push(field.replace(/^"|"$/g, '').replace(/""/g, '"'));

  dealers.push({
    name: fields[0] || '',
    address: fields[1] || '',
    phone: fields[2] || '',
    website: fields[3] || '',
    googleMaps: fields[4] || '',
    rating: fields[5] || '',
    reviews: fields[6] || '',
    city: fields[7] || '',
    email: '', // To be found
  });
}

console.log(`🔍 IQ Auto Deals - Email Finder`);
console.log(`================================\n`);
console.log(`Loaded ${dealers.length} dealers from ${csvFile}`);
console.log(`Dealers with websites: ${dealers.filter(d => d.website).length}\n`);

// Email regex pattern
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Common email prefixes to try
const commonPrefixes = ['info', 'sales', 'contact', 'service', 'admin', 'hello', 'support'];

function fetchUrl(url, timeout = 10000) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;

      const req = protocol.get(url, {
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      }, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let redirectUrl = res.headers.location;
          if (redirectUrl.startsWith('/')) {
            redirectUrl = `${urlObj.protocol}//${urlObj.host}${redirectUrl}`;
          }
          fetchUrl(redirectUrl, timeout).then(resolve);
          return;
        }

        if (res.statusCode !== 200) {
          resolve('');
          return;
        }

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });

      req.on('error', () => resolve(''));
      req.on('timeout', () => {
        req.destroy();
        resolve('');
      });
    } catch (e) {
      resolve('');
    }
  });
}

function extractEmails(html) {
  if (!html) return [];

  // Find mailto: links
  const mailtoRegex = /mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  const mailtoMatches = [...html.matchAll(mailtoRegex)].map(m => m[1].toLowerCase());

  // Find emails in text
  const textMatches = (html.match(emailRegex) || []).map(e => e.toLowerCase());

  // Combine and dedupe
  const allEmails = [...new Set([...mailtoMatches, ...textMatches])];

  // Filter out common false positives
  const filtered = allEmails.filter(email => {
    // Skip image files, example emails, etc.
    if (email.includes('example.com')) return false;
    if (email.includes('domain.com')) return false;
    if (email.includes('email.com')) return false;
    if (email.includes('yoursite.com')) return false;
    if (email.includes('yourdomain')) return false;
    if (email.endsWith('.png')) return false;
    if (email.endsWith('.jpg')) return false;
    if (email.endsWith('.gif')) return false;
    if (email.endsWith('.webp')) return false;
    if (email.includes('wixpress')) return false;
    if (email.includes('sentry.io')) return false;
    if (email.includes('schema.org')) return false;
    if (email.includes('w3.org')) return false;
    if (email.includes('google.com')) return false;
    if (email.includes('facebook.com')) return false;
    if (email.includes('twitter.com')) return false;
    if (email.includes('@2x')) return false;
    if (email.includes('@3x')) return false;
    return true;
  });

  // Prioritize certain emails
  const prioritized = filtered.sort((a, b) => {
    const getPriority = (email) => {
      if (email.startsWith('sales@')) return 1;
      if (email.startsWith('info@')) return 2;
      if (email.startsWith('contact@')) return 3;
      if (email.startsWith('service@')) return 4;
      return 5;
    };
    return getPriority(a) - getPriority(b);
  });

  return prioritized;
}

function getDomain(website) {
  try {
    const url = new URL(website);
    return url.hostname.replace('www.', '');
  } catch {
    return null;
  }
}

async function findEmailsForDealer(dealer) {
  if (!dealer.website) return [];

  const allEmails = new Set();
  const domain = getDomain(dealer.website);

  // Pages to check
  const pagesToCheck = [
    dealer.website,
    dealer.website.replace(/\/$/, '') + '/contact',
    dealer.website.replace(/\/$/, '') + '/contact-us',
    dealer.website.replace(/\/$/, '') + '/about',
    dealer.website.replace(/\/$/, '') + '/about-us',
  ];

  for (const pageUrl of pagesToCheck) {
    const html = await fetchUrl(pageUrl);
    const emails = extractEmails(html);
    emails.forEach(e => allEmails.add(e));

    // If we found emails, don't need to check more pages
    if (allEmails.size > 0) break;
  }

  // If still no emails and we have a domain, try common patterns
  if (allEmails.size === 0 && domain) {
    // We can't verify these without actually sending, so we'll skip this
    // But we could add them as "guessed" emails
  }

  return [...allEmails];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const results = [];
  let foundCount = 0;
  let processed = 0;

  // Only process dealers with websites
  const dealersWithSites = dealers.filter(d => d.website);

  console.log(`Starting email extraction for ${dealersWithSites.length} dealers...\n`);

  for (const dealer of dealersWithSites) {
    processed++;
    process.stdout.write(`\r[${processed}/${dealersWithSites.length}] Checking: ${dealer.name.substring(0, 40).padEnd(40)} `);

    const emails = await findEmailsForDealer(dealer);

    if (emails.length > 0) {
      dealer.email = emails[0]; // Primary email
      dealer.allEmails = emails.join('; '); // All found emails
      foundCount++;
      process.stdout.write(`✅ ${emails[0]}`);
    } else {
      process.stdout.write(`❌ No email found`);
    }

    results.push(dealer);

    // Small delay to be respectful
    await sleep(100);
  }

  // Add dealers without websites (no email possible)
  dealers.filter(d => !d.website).forEach(d => results.push(d));

  console.log(`\n\n📊 Results:`);
  console.log(`   Dealers checked: ${dealersWithSites.length}`);
  console.log(`   Emails found: ${foundCount}`);
  console.log(`   Success rate: ${Math.round((foundCount / dealersWithSites.length) * 100)}%\n`);

  // Create new CSV with emails
  const newHeader = 'Name,Address,Phone,Website,Email,All Emails,Google Maps,Rating,Reviews,City';
  const newRows = results.map(d => {
    const escape = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;
    return [
      escape(d.name),
      escape(d.address),
      escape(d.phone),
      escape(d.website),
      escape(d.email),
      escape(d.allEmails || ''),
      escape(d.googleMaps),
      d.rating || '',
      d.reviews || '',
      escape(d.city),
    ].join(',');
  });

  const newCsv = newHeader + '\n' + newRows.join('\n');
  const outputFile = csvFile.replace('.csv', '-with-emails.csv');
  fs.writeFileSync(outputFile, newCsv);

  console.log(`✅ Saved to: ${outputFile}`);

  // Also create a filtered list with only dealers that have emails
  const withEmails = results.filter(d => d.email);
  const filteredRows = withEmails.map(d => {
    const escape = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;
    return [
      escape(d.name),
      escape(d.address),
      escape(d.phone),
      escape(d.website),
      escape(d.email),
      escape(d.allEmails || ''),
      escape(d.googleMaps),
      d.rating || '',
      d.reviews || '',
      escape(d.city),
    ].join(',');
  });

  const filteredCsv = newHeader + '\n' + filteredRows.join('\n');
  const filteredFile = csvFile.replace('.csv', '-emails-only.csv');
  fs.writeFileSync(filteredFile, filteredCsv);

  console.log(`✅ Emails-only list: ${filteredFile} (${withEmails.length} dealers)\n`);
}

main().catch(console.error);
