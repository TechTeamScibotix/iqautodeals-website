const nodemailer = require('nodemailer');

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'noreply@iqautodeals.com',
    pass: '$Jd900659',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Dealers to email
const dealers = [
  { name: 'Rainey Used Cars', email: 'info@raineyga.com' },
  { name: 'G to G Towing', email: 'matt@pixelspread.com' },
  { name: 'Preston Diversified Auto Inc', email: 'prestondivsales@gmail.com' },
  { name: 'Arena Motors LLC', email: 'alexarenamotors@gmail.com' },
  { name: 'Anchor Auto Center LLC', email: 'info@anchorautocenter.com' },
  { name: 'ASAP Auto Brokers LLC', email: 'asapautobrokers@gmail.com' },
  { name: 'Georgia Auto Brokers', email: 'gacarbrokers@gmail.com' },
  { name: 'Classic Atlanta Pre-Owned', email: 'smorales@classicatlanta.com' },
  { name: 'Carmona Auto Sales LLC', email: 'carmonaautosales1@gmail.com' },
  { name: 'Atlanta True Cars', email: 'atlantatruecars@gmail.com' },
  { name: "Kenny's Automotive Center", email: 'byronk515@gmail.com' },
  { name: 'Autos Buy Don', email: 'autosbuydon@gmail.com' },
  { name: 'The Car Market', email: 'thecarmarketbuyers@gmail.com' },
  { name: 'Galaxy Car Sales LLC', email: 'james.belisha@gmail.com' },
  { name: 'Better Way Auto Sales', email: 'bwautosalesga@gmail.com' },
  { name: 'Parwan Auto LLC', email: 'zacwakili2005@gmail.com' },
  { name: 'Georgia Hwy 20 Auto Sales', email: 'sales@georgiaautosale.com' },
  { name: 'Sher Motors', email: 'shermotorsllc@gmail.com' },
  { name: 'Vaden of Beaufort', email: 'beaufort@vadenauto.com' },
  { name: 'Capital City Buick GMC', email: 'leads@capitalcitygmc.net' },
  { name: 'Mercedes-Benz of Augusta', email: 'dmcconnell@mbaugusta.com' },
  { name: 'Benji Auto Sales', email: 'sales@benjiautosales.com' },
  { name: 'Augusta Toyota', email: 'lrobinson@augustatoyota.com' },
  { name: 'Mercedes-Benz of Columbus', email: 'mbcolumbusgm@mercedescolumbus.net' },
  { name: 'Thomson Chrysler Dodge Jeep Ram Fiat', email: 'sales@thomsoncdjrf.com' },
  { name: 'Hilton Head Volkswagen', email: 'info@hiltonheadvw.com' },
  { name: 'BMW of Athens', email: 'jessica.sopson@athensbmw.com' },
  { name: 'BMW of Columbus', email: 'georgia.simonds@bmwofcolumbus.com' },
  { name: 'Genesis of Kennesaw', email: 'ctompkins@genesisofkennesaw.com' },
  { name: 'RBM of Alpharetta', email: 'webleads@rbmofalpharetta.com' },
  { name: 'Jim Hudson Acura', email: 'contact@jimhudsonacura.com' },
  { name: '1 Owner Auto Sales', email: '1ownerautosales@gmail.com' },
  { name: 'Foster Auto Sales', email: 'dfoster@fosterautosales.net' },
  { name: 'McDaniels Acura of Newnan', email: 'leads@mcdanielsnewnan.com' },
  { name: "Bullock's Auto Sales", email: 'bullocksautosales@gmail.com' },
  { name: 'Mi Carro Auto Sales', email: 'micarroautosales@gmail.com' },
  { name: 'Merlin Auto Group', email: 'sales@merlinautogroup.com' },
  { name: 'Savannah Auto Trader', email: 'info@savannahautotrader.com' },
];

// Email template
function generateEmail(dealerName) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(to right, #0066cc, #10b981); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .section-title { color: #0066cc; font-size: 18px; font-weight: bold; margin-top: 25px; margin-bottom: 10px; }
    .bullet-list { margin: 15px 0; padding-left: 0; }
    .bullet-item { margin: 10px 0; padding-left: 25px; position: relative; }
    .bullet-item:before { content: "•"; color: #10b981; font-weight: bold; position: absolute; left: 0; }
    .bullet-title { font-weight: bold; color: #333; }
    .promo-box { background: linear-gradient(to right, #fef3c7, #fde68a); border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center; }
    .promo-title { color: #b45309; font-size: 16px; font-weight: bold; margin-bottom: 5px; }
    .promo-text { color: #92400e; font-size: 15px; }
    .cta-section { text-align: center; margin: 30px 0; }
    .cta-button { display: inline-block; background: #10b981; color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; }
    .footer { text-align: left; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .signature { color: #333; }
    .signature-name { font-weight: bold; }
    .signature-title { color: #666; }
    .signature-email { color: #0066cc; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>IQ Auto Deals</h1>
    </div>
    <div class="content">
      <p>Dear ${dealerName} Team,</p>

      <p>I'm Joe Duran from Scibotix Solutions, founders of IQ Auto Deals – a new nationwide automotive marketplace designed to connect dealers directly with serious buyers.</p>

      <div class="section-title">The Problem We're Solving</div>
      <p>Traditional listing sites charge you monthly fees whether you sell or not. Customers browse anonymously, and you spend hours chasing leads that go nowhere.</p>

      <div class="section-title">How IQ Auto Deals Works</div>
      <p>Our platform flips the script. Customers don't just browse – they take action:</p>

      <div class="bullet-list">
        <div class="bullet-item"><span class="bullet-title">Deal Requests:</span> Customers select up to 4 vehicles they're serious about and submit a deal request directly to you</div>
        <div class="bullet-item"><span class="bullet-title">You're in Control:</span> Review the request and respond with your best offer on your terms</div>
        <div class="bullet-item"><span class="bullet-title">Better Buyers:</span> No more tire kickers – only customers ready to make a deal</div>
        <div class="bullet-item"><span class="bullet-title">Direct Communication:</span> Negotiate directly with buyers, no middleman</div>
      </div>

      <div class="section-title">What We're Offering</div>
      <p>We're currently onboarding dealers nationwide with a <strong>free 90-day trial</strong> – free account setup and free inventory listings to get you started.</p>

      <div class="promo-box">
        <div class="promo-title">SPECIAL PROMO</div>
        <div class="promo-text">For a limited time, the first 100 registered dealers get<br><strong>unlimited access and zero fees for 12 months</strong> – on us!</div>
      </div>

      <p>Your team can be up and running in minutes. Simply upload your inventory and start receiving deal requests from customers actively looking to buy.</p>

      <div class="cta-section">
        <a href="https://iqautodeals.com/register" class="cta-button">Create Your Free Dealer Account</a>
      </div>

      <p>I'd be happy to answer any questions.</p>

      <div class="footer">
        <div class="signature">
          <p>Best regards,</p>
          <p class="signature-name">Joe Duran</p>
          <p class="signature-title">Founder, IQ Auto Deals</p>
          <p class="signature-email">techteam@scibotixsolutions.com</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `Dear ${dealerName} Team,

I'm Joe Duran from Scibotix Solutions, founders of IQ Auto Deals – a new nationwide automotive marketplace designed to connect dealers directly with serious buyers.

The Problem We're Solving

Traditional listing sites charge you monthly fees whether you sell or not. Customers browse anonymously, and you spend hours chasing leads that go nowhere.

How IQ Auto Deals Works

Our platform flips the script. Customers don't just browse – they take action:

• Deal Requests: Customers select up to 4 vehicles they're serious about and submit a deal request directly to you
• You're in Control: Review the request and respond with your best offer on your terms
• Better Buyers: No more tire kickers – only customers ready to make a deal
• Direct Communication: Negotiate directly with buyers, no middleman

What We're Offering

We're currently onboarding dealers nationwide with a free 90-day trial – free account setup and free inventory listings to get you started.

SPECIAL PROMO: For a limited time, the first 100 registered dealers get unlimited access and zero fees for 12 months – on us!

Your team can be up and running in minutes. Simply upload your inventory and start receiving deal requests from customers actively looking to buy.

Get Started: https://iqautodeals.com/register

I'd be happy to answer any questions.

Best regards,

Joe Duran
Founder, IQ Auto Deals
techteam@scibotixsolutions.com
`;

  return { html, text };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendEmails() {
  console.log('📧 IQ Auto Deals - Dealer Outreach Campaign');
  console.log('==========================================\n');
  console.log(`Sending to ${dealers.length} dealers...\n`);

  let sent = 0;
  let failed = 0;

  for (const dealer of dealers) {
    const { html, text } = generateEmail(dealer.name);

    try {
      await transporter.sendMail({
        from: '"Joe Duran - IQ Auto Deals" <noreply@iqautodeals.com>',
        replyTo: 'techteam@scibotixsolutions.com',
        to: dealer.email,
        subject: 'Introducing IQ Auto Deals – A Smarter Way to Sell Cars',
        html,
        text,
      });

      sent++;
      console.log(`✅ [${sent}/${dealers.length}] Sent to ${dealer.name} (${dealer.email})`);

      // Delay between emails to avoid rate limiting
      await sleep(2000);

    } catch (error) {
      failed++;
      console.log(`❌ [${sent + failed}/${dealers.length}] Failed: ${dealer.name} (${dealer.email}) - ${error.message}`);
    }
  }

  console.log('\n==========================================');
  console.log(`📊 Results: ${sent} sent, ${failed} failed`);
  console.log('==========================================\n');
}

sendEmails().catch(console.error);
