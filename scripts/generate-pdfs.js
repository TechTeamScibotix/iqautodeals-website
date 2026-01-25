const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDFs() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });

  const pages = [
    { url: 'https://www.iqautodeals.com/privacy', filename: 'IQ-Auto-Deals-Privacy-Policy.pdf', title: 'Privacy Policy' },
    { url: 'https://www.iqautodeals.com/terms', filename: 'IQ-Auto-Deals-Terms-of-Service.pdf', title: 'Terms of Service' }
  ];

  for (const pageInfo of pages) {
    console.log(`Generating ${pageInfo.title} PDF...`);
    const page = await browser.newPage();

    await page.goto(pageInfo.url, { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for content to fully load
    await page.waitForSelector('main', { timeout: 10000 }).catch(() => {});

    // Hide header and footer for cleaner PDF
    await page.evaluate(() => {
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      if (header) header.style.display = 'none';
      if (footer) footer.style.display = 'none';
    });

    const outputPath = path.join(__dirname, '..', 'public', pageInfo.filename);

    await page.pdf({
      path: outputPath,
      format: 'Letter',
      margin: {
        top: '0.75in',
        right: '0.75in',
        bottom: '0.75in',
        left: '0.75in'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; color: #666; width: 100%; text-align: center; padding: 10px 0;">
          IQ Auto Deals - ${pageInfo.title}
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 10px; color: #666; width: 100%; text-align: center; padding: 10px 0;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span> | www.iqautodeals.com
        </div>
      `
    });

    console.log(`  Saved to: ${outputPath}`);
    await page.close();
  }

  await browser.close();
  console.log('Done! PDFs generated successfully.');
}

generatePDFs().catch(err => {
  console.error('Error generating PDFs:', err);
  process.exit(1);
});
