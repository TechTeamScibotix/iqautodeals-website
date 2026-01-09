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

// NC Dealers to email
const dealers = [
  { name: 'Autos Direct', email: 'bbowlin@autosdirectnc.com' },
  { name: 'Cadillac Of Fayetteville', email: 'bill.shotwell@cadillacoffayetteville.com' },
  { name: 'Clutch Motors LLC', email: 'clutchmotorsllc@gmail.com' },
  { name: 'Team EZ Auto', email: 'cmartin@teamezauto.com' },
  { name: 'Coast Motors Inc', email: 'coastmotorsinc@gmail.com' },
  { name: 'TLC Automotive', email: 'contact@carstlc.com' },
  { name: 'Hendrick Chevrolet', email: 'david.ward@hendrickauto.com' },
  { name: 'Modern Classic Motorcars', email: 'dealer@modernclassicmotorcars.com' },
  { name: 'Black Label Motors', email: 'dlabel@blacklabelmotors.com' },
  { name: 'East Carolina Auto', email: 'fcalfee@ecauto.com' },
  { name: 'Flow Honda Winston Salem', email: 'flowhondawinstonsalem@eleadtrack.net' },
  { name: 'Hendrick Chrysler Jeep Fayetteville', email: 'hcjsales@hendrickauto.com' },
  { name: 'Rick Hendrick City Chevrolet', email: 'heather.drayton@hendrickauto.com' },
  { name: 'Hendrick Honda Jacksonville', email: 'hhj-sales@hendrickauto.com' },
  { name: 'Hendrick Honda Wilmington', email: 'how-salesmanagers@hendrickauto.com' },
  { name: 'ELFER', email: 'info@elfer.us' },
  { name: 'Top Motors NC', email: 'info@topmotorsnc.com' },
  { name: 'Mercedes-Benz of Asheville', email: 'jackson@fieldsauto.com' },
  { name: "Jay's Used Cars LLC", email: 'jaysusedcars@gmail.com' },
  { name: 'Johnson Lexus of Durham', email: 'johnsonlexusofdurham@eleadtrack.net' },
  { name: 'Johnson Subaru of Cary', email: 'johnsonsubaruofcary@eleadtrack.net' },
  { name: 'Hendrick Cadillac Cary', email: 'joshua.feldman@hendrickauto.com' },
  { name: 'Audi Charlotte', email: 'jsimmons@drivedag.com' },
  { name: 'BMW of Asheville', email: 'larryt@fieldsauto.com' },
  { name: 'Carolina Cars', email: 'lbrrholding@yahoo.com' },
  { name: 'Medlin Buick GMC', email: 'leads@buickgmcmazda.medlincars.com' },
  { name: 'I40 Auto', email: 'leads@i40autogroup.com' },
  { name: 'Pecheles Honda', email: 'leads@pecheleshondaclients.com' },
  { name: 'Hendrick Kia of Cary', email: 'luke.lavoie@hendrickauto.com' },
  { name: 'Reggie Jackson Airport Honda', email: 'lum-sales@hendrickauto.com' },
  { name: 'Motorcar Trader', email: 'marc@motorcartrader.com' },
  { name: 'AutoNation USA Charlotte', email: 'marketingsupport@autonation.com' },
  { name: 'Motors On Main', email: 'motorsonmain@gmail.com' },
  { name: 'Modern Nissan of Hickory', email: 'nissanhkcontactus@modernauto.com' },
  { name: 'Harris Cars Inc', email: 'office@harriscarsinc.com' },
  { name: 'Parks Chevrolet Huntersville', email: 'phvsalesmanagers@parksautogroup.com' },
  { name: 'Coastal Kia', email: 'pkoballa@coastalkia.com' },
  { name: 'Ridgeline Automotive', email: 'ridgelineauto@gmail.com' },
  { name: 'Riverside Vehicles', email: 'rjakes@riversidevehicles.com' },
  { name: 'RS Motorsports NC', email: 'rob@rsmotorsportsnc.com' },
  { name: 'Kings Auto Sales', email: 'sales@651king.com' },
  { name: 'Bob King Buick GMC', email: 'sales@bobking.com' },
  { name: 'Crown Auto Sales', email: 'sales@buyatcrown.com' },
  { name: 'Flow Hyundai Statesville', email: 'sales@flowhyundaistatesville.edealerhub.com' },
  { name: 'GSO Auto', email: 'sales@gsoauto.com' },
  { name: 'Impex Auto Sales', email: 'sales@impexautosales.com' },
  { name: 'Ivey Motorcars', email: 'sales@iveymotorcars.com' },
  { name: 'Lamborghini Carolinas', email: 'sales@lamborghinicarolinas.com' },
  { name: 'MRZ Auto Group', email: 'sales@mrzautogroup.com' },
  { name: 'Wholesale Direct Auto', email: 'sales@wholesaledirectauto.com' },
  { name: 'Taylor Smith Automotive', email: 'taylorsmithautomotive@gmail.com' },
  { name: 'Toyota of North Charlotte', email: 'toyotaofnorthcharlotte@eleadtrack.net' },
  { name: "Vann's Auto Sales", email: 'vannlane@yahoo.com' },
  { name: 'Hendrick Toyota Concord', email: 'vernita.reveron@hendrickauto.com' },
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
  console.log('📧 IQ Auto Deals - NC Dealer Outreach');
  console.log('=====================================\n');
  console.log(`Sending to ${dealers.length} NC dealers...\n`);

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

  console.log('\n=====================================');
  console.log(`📊 Results: ${sent} sent, ${failed} failed`);
  console.log('=====================================\n');
}

sendEmails().catch(console.error);
