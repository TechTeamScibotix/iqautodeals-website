import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // SMTP_PASS is Base64 encoded because $ in passwords gets interpreted as shell variable
  const smtpPass = process.env.SMTP_PASS_B64
    ? Buffer.from(process.env.SMTP_PASS_B64, 'base64').toString('utf8')
    : process.env.SMTP_PASS?.trim();

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim(),
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Email template base styles
const baseStyles = `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: linear-gradient(to right, #0066cc, #9333ea, #f97316); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
  .header h1 { color: white; margin: 0; font-size: 28px; }
  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
  .button { display: inline-block; background: #0066cc; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
  .button-green { background: #10b981; }
  .button-orange { background: #f97316; }
  .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  .highlight { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 15px 0; }
  .car-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0; }
`;

// Generic send email function
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: '"IQ Auto Deals" <noreply@iqautodeals.com>',
    to,
    subject,
    html,
    text,
  });
}

// Welcome email for customers
export async function sendCustomerWelcomeEmail(email: string, name: string) {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://iqautodeals.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to IQ Auto Deals!</h1>
        </div>
        <div class="content">
          <p>Hi ${name || 'there'},</p>
          <p>Welcome to <strong>IQ Auto Deals</strong> - your smart way to find and negotiate on your next vehicle!</p>

          <div class="highlight">
            <strong>Here's how it works:</strong>
            <ol>
              <li>Browse our inventory of quality vehicles</li>
              <li>Select up to 4 cars you're interested in</li>
              <li>Submit a deal request and let dealers compete for your business</li>
              <li>Review offers and pick the best deal</li>
            </ol>
          </div>

          <p style="text-align: center;">
            <a href="${siteUrl}/customer" class="button">Start Browsing Cars</a>
          </p>

          <p>Have questions? Our team is here to help you find the perfect vehicle at the best price.</p>
        </div>
        <div class="footer">
          <p>© 2025 IQ Auto Deals. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to IQ Auto Deals!

Hi ${name || 'there'},

Welcome to IQ Auto Deals - your smart way to find and negotiate on your next vehicle!

Here's how it works:
1. Browse our inventory of quality vehicles
2. Select up to 4 cars you're interested in
3. Submit a deal request and let dealers compete for your business
4. Review offers and pick the best deal

Start browsing at: ${siteUrl}/customer

© 2025 IQ Auto Deals
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to IQ Auto Deals!',
    html,
    text,
  });
}

// Welcome email for dealers (with license instructions)
export async function sendDealerWelcomeEmail(email: string, businessName: string) {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://iqautodeals.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to IQ Auto Deals!</h1>
        </div>
        <div class="content">
          <p>Hi ${businessName},</p>
          <p>Thank you for registering your dealership with <strong>IQ Auto Deals</strong>!</p>

          <div class="highlight" style="background: #fef3c7; border-left: 4px solid #f59e0b;">
            <strong>Important: Verification Required</strong>
            <p style="margin-bottom: 0;">To complete your registration and start listing inventory, please email a copy of your <strong>business license</strong> to:</p>
            <p style="font-size: 18px; font-weight: bold; color: #0066cc; margin: 10px 0;">
              <a href="mailto:Techteam@scibotixsolutions.com">Techteam@scibotixsolutions.com</a>
            </p>
            <p style="margin-bottom: 0; font-size: 14px;">Our team will review and approve your account within 1-2 business days.</p>
          </div>

          <p><strong>What happens next?</strong></p>
          <ul>
            <li>We'll verify your business license</li>
            <li>You'll receive an email once approved</li>
            <li>Your inventory will go live on our platform</li>
            <li>Start receiving deal requests from customers!</li>
          </ul>

          <p style="text-align: center;">
            <a href="${siteUrl}/dealer" class="button button-orange">Access Dealer Dashboard</a>
          </p>
        </div>
        <div class="footer">
          <p>© 2025 IQ Auto Deals. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to IQ Auto Deals!

Hi ${businessName},

Thank you for registering your dealership with IQ Auto Deals!

IMPORTANT: VERIFICATION REQUIRED
To complete your registration and start listing inventory, please email a copy of your business license to:
Techteam@scibotixsolutions.com

Our team will review and approve your account within 1-2 business days.

What happens next?
- We'll verify your business license
- You'll receive an email once approved
- Your inventory will go live on our platform
- Start receiving deal requests from customers!

Access your dealer dashboard: ${siteUrl}/dealer

© 2025 IQ Auto Deals
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to IQ Auto Deals - Verification Required',
    html,
    text,
  });
}

// Admin notification for new dealer registration
export async function sendAdminNewDealerNotification(
  dealerEmail: string,
  businessName: string,
  dealerName: string,
  phone: string | null
) {
  const adminEmail = 'Techteam@scibotixsolutions.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(to right, #dc2626, #f97316);">
          <h1>New Dealer Registration</h1>
        </div>
        <div class="content">
          <p>A new dealer has registered and is awaiting verification:</p>

          <div class="car-card">
            <p><strong>Business Name:</strong> ${businessName}</p>
            <p><strong>Contact Name:</strong> ${dealerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${dealerEmail}">${dealerEmail}</a></p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          </div>

          <p>Please wait for them to submit their business license, then approve or reject their account in the admin dashboard.</p>

          <p style="text-align: center;">
            <a href="https://scibotixsolutions.com/admin/dealers" class="button button-orange">Go to Admin Dashboard</a>
          </p>
        </div>
        <div class="footer">
          <p>IQ Auto Deals Admin Notification</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Dealer Registration - IQ Auto Deals

A new dealer has registered and is awaiting verification:

Business Name: ${businessName}
Contact Name: ${dealerName}
Email: ${dealerEmail}
Phone: ${phone || 'Not provided'}

Please wait for them to submit their business license, then approve or reject their account in the admin dashboard.

Admin Dashboard: https://scibotixsolutions.com/admin/dealers
  `;

  await sendEmail({
    to: adminEmail,
    subject: `New Dealer Registration: ${businessName}`,
    html,
    text,
  });
}

// Dealer approval notification
export async function sendDealerApprovalEmail(email: string, businessName: string) {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://iqautodeals.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(to right, #10b981, #0066cc);">
          <h1>You're Approved!</h1>
        </div>
        <div class="content">
          <p>Great news, ${businessName}!</p>
          <p>Your dealership has been <strong style="color: #10b981;">verified and approved</strong> on IQ Auto Deals.</p>

          <div class="highlight" style="background: #d1fae5;">
            <strong>You can now:</strong>
            <ul style="margin-bottom: 0;">
              <li>List your inventory on our platform</li>
              <li>Receive deal requests from customers</li>
              <li>Submit offers and negotiate deals</li>
              <li>Manage test drives and close sales</li>
            </ul>
          </div>

          <p style="text-align: center;">
            <a href="${siteUrl}/dealer" class="button button-green">Go to Dealer Dashboard</a>
          </p>

          <p>Start adding your vehicles now and let customers find their perfect car!</p>
        </div>
        <div class="footer">
          <p>© 2025 IQ Auto Deals. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
You're Approved! - IQ Auto Deals

Great news, ${businessName}!

Your dealership has been verified and approved on IQ Auto Deals.

You can now:
- List your inventory on our platform
- Receive deal requests from customers
- Submit offers and negotiate deals
- Manage test drives and close sales

Go to your dealer dashboard: ${siteUrl}/dealer

Start adding your vehicles now and let customers find their perfect car!

© 2025 IQ Auto Deals
  `;

  await sendEmail({
    to: email,
    subject: 'Your Dealership is Approved! - IQ Auto Deals',
    html,
    text,
  });
}

// Dealer rejection notification
export async function sendDealerRejectionEmail(email: string, businessName: string, reason?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(to right, #6b7280, #374151);">
          <h1>Registration Update</h1>
        </div>
        <div class="content">
          <p>Hi ${businessName},</p>
          <p>We regret to inform you that your dealership registration has not been approved at this time.</p>

          ${reason ? `
          <div class="highlight" style="background: #fef2f2;">
            <strong>Reason:</strong>
            <p style="margin-bottom: 0;">${reason}</p>
          </div>
          ` : ''}

          <p>If you believe this is an error or would like to provide additional documentation, please contact us at:</p>
          <p style="text-align: center;">
            <a href="mailto:Techteam@scibotixsolutions.com" class="button">Contact Support</a>
          </p>
        </div>
        <div class="footer">
          <p>© 2025 IQ Auto Deals. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Registration Update - IQ Auto Deals

Hi ${businessName},

We regret to inform you that your dealership registration has not been approved at this time.

${reason ? `Reason: ${reason}` : ''}

If you believe this is an error or would like to provide additional documentation, please contact us at:
Techteam@scibotixsolutions.com

© 2025 IQ Auto Deals
  `;

  await sendEmail({
    to: email,
    subject: 'IQ Auto Deals - Registration Update',
    html,
    text,
  });
}

// Deal request notification to dealer
export async function sendDealerDealRequestNotification(
  dealerEmail: string,
  dealerName: string,
  customerName: string,
  cars: { year: number; make: string; model: string; price: number }[]
) {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://iqautodeals.com';

  const carsList = cars.map(car => `
    <div class="car-card">
      <strong>${car.year} ${car.make} ${car.model}</strong>
      <p style="margin: 5px 0; color: #10b981; font-weight: bold;">Asking Price: $${car.price.toLocaleString()}</p>
    </div>
  `).join('');

  const carsText = cars.map(car =>
    `- ${car.year} ${car.make} ${car.model} - $${car.price.toLocaleString()}`
  ).join('\n');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(to right, #10b981, #0066cc);">
          <h1>New Deal Request!</h1>
        </div>
        <div class="content">
          <p>Hi ${dealerName},</p>
          <p><strong>${customerName}</strong> is interested in making a deal on the following vehicle${cars.length > 1 ? 's' : ''} from your inventory:</p>

          ${carsList}

          <p style="text-align: center;">
            <a href="${siteUrl}/dealer" class="button button-green">View & Submit Offer</a>
          </p>

          <p><strong>Tip:</strong> Customers can receive offers from multiple dealers. Submit your best competitive offer to win the deal!</p>
        </div>
        <div class="footer">
          <p>© 2025 IQ Auto Deals. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Deal Request! - IQ Auto Deals

Hi ${dealerName},

${customerName} is interested in making a deal on the following vehicle${cars.length > 1 ? 's' : ''} from your inventory:

${carsText}

View and submit your offer: ${siteUrl}/dealer

Tip: Customers can receive offers from multiple dealers. Submit your best competitive offer to win the deal!

© 2025 IQ Auto Deals
  `;

  await sendEmail({
    to: dealerEmail,
    subject: `New Deal Request from ${customerName}!`,
    html,
    text,
  });
}

// Availability request notification to dealer
export async function sendDealerAvailabilityRequestNotification(
  dealerEmail: string,
  dealerName: string,
  car: { year: number; make: string; model: string; vin: string; price: number },
  customer: { firstName: string; lastName: string; email: string; phone: string; zipCode: string; comments?: string }
) {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://iqautodeals.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(to right, #0066cc, #10b981);">
          <h1>New Availability Request!</h1>
        </div>
        <div class="content">
          <p>Hi ${dealerName},</p>
          <p>A customer is interested in one of your vehicles and wants to check availability:</p>

          <div class="car-card">
            <h3 style="margin: 0 0 10px; color: #333;">${car.year} ${car.make} ${car.model}</h3>
            <p style="margin: 5px 0; color: #666;">VIN: ${car.vin}</p>
            <p style="margin: 5px 0; color: #10b981; font-weight: bold; font-size: 18px;">Price: $${car.price.toLocaleString()}</p>
          </div>

          <div class="highlight">
            <strong>Customer Information:</strong>
            <p style="margin: 10px 0 5px;"><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${customer.email}">${customer.email}</a></p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${customer.phone.replace(/\D/g, '')}">${customer.phone}</a></p>
            <p style="margin: 5px 0;"><strong>ZIP Code:</strong> ${customer.zipCode}</p>
            ${customer.comments ? `<p style="margin: 10px 0 0;"><strong>Comments:</strong> ${customer.comments}</p>` : ''}
          </div>

          <p style="text-align: center;">
            <a href="tel:${customer.phone.replace(/\D/g, '')}" class="button button-green">Call Customer</a>
            <a href="mailto:${customer.email}" class="button" style="margin-left: 10px;">Email Customer</a>
          </p>

          <p><strong>Tip:</strong> Respond quickly to availability requests - customers are actively shopping and may reach out to multiple dealers!</p>
        </div>
        <div class="footer">
          <p>© 2025 IQ Auto Deals. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Availability Request! - IQ Auto Deals

Hi ${dealerName},

A customer is interested in one of your vehicles and wants to check availability:

Vehicle: ${car.year} ${car.make} ${car.model}
VIN: ${car.vin}
Price: $${car.price.toLocaleString()}

Customer Information:
- Name: ${customer.firstName} ${customer.lastName}
- Email: ${customer.email}
- Phone: ${customer.phone}
- ZIP Code: ${customer.zipCode}
${customer.comments ? `- Comments: ${customer.comments}` : ''}

Respond quickly to win the sale!

© 2025 IQ Auto Deals
  `;

  await sendEmail({
    to: dealerEmail,
    subject: `Availability Request: ${car.year} ${car.make} ${car.model}`,
    html,
    text,
  });
}

// Customer notification when receiving an offer
export async function sendCustomerOfferNotification(
  customerEmail: string,
  customerName: string,
  dealerName: string,
  car: { year: number; make: string; model: string },
  originalPrice: number,
  offerPrice: number,
  isFirmPrice: boolean = false
) {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://iqautodeals.com';
  const savings = originalPrice - offerPrice;
  const savingsPercent = Math.round((savings / originalPrice) * 100);

  const firmPriceBadge = isFirmPrice ? `
            <div style="background: linear-gradient(to right, #f97316, #ea580c); color: white; padding: 10px 20px; border-radius: 8px; margin: 15px 0; font-weight: bold; text-align: center;">
              💰 FIRM PRICE - This is the dealer's best and final offer
            </div>
  ` : '';

  const firmPriceNote = isFirmPrice
    ? '<p style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px; color: #c2410c; font-size: 14px;"><strong>Note:</strong> The dealer has indicated this is their firm price and is not open to negotiation on this vehicle.</p>'
    : '<p><strong>Remember:</strong> You may receive offers from multiple dealers. Take your time to compare and choose the best deal!</p>';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(to right, #f97316, #10b981);">
          <h1>${isFirmPrice ? 'Firm Price Offer!' : 'You Got an Offer!'}</h1>
        </div>
        <div class="content">
          <p>Hi ${customerName || 'there'},</p>
          <p>${isFirmPrice ? `<strong>${dealerName}</strong> has submitted their <strong>firm price</strong> on your deal request:` : `Great news! <strong>${dealerName}</strong> has submitted an offer on your deal request:`}</p>

          <div class="car-card" style="text-align: center;">
            <h3 style="margin: 0; color: #333;">${car.year} ${car.make} ${car.model}</h3>
            ${firmPriceBadge}
            <p style="color: #6b7280; text-decoration: line-through; margin: 10px 0 5px;">Original: $${originalPrice.toLocaleString()}</p>
            <p style="font-size: 28px; font-weight: bold; color: #10b981; margin: 5px 0;">$${offerPrice.toLocaleString()}</p>
            ${savings > 0 ? `<p style="color: #f97316; font-weight: bold;">Save $${savings.toLocaleString()} (${savingsPercent}% off!)</p>` : ''}
          </div>

          <p style="text-align: center;">
            <a href="${siteUrl}/customer" class="button button-green">View Offer & Respond</a>
          </p>

          ${firmPriceNote}
        </div>
        <div class="footer">
          <p>© 2025 IQ Auto Deals. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
${isFirmPrice ? 'Firm Price Offer!' : 'You Got an Offer!'} - IQ Auto Deals

Hi ${customerName || 'there'},

${isFirmPrice ? `${dealerName} has submitted their FIRM PRICE on your deal request:` : `Great news! ${dealerName} has submitted an offer on your deal request:`}

${car.year} ${car.make} ${car.model}
Original Price: $${originalPrice.toLocaleString()}
${isFirmPrice ? 'FIRM PRICE' : 'Offer Price'}: $${offerPrice.toLocaleString()}
${savings > 0 ? `You Save: $${savings.toLocaleString()} (${savingsPercent}% off!)` : ''}

View offer and respond: ${siteUrl}/customer

${isFirmPrice ? 'Note: The dealer has indicated this is their firm price and is not open to negotiation on this vehicle.' : 'Remember: You may receive offers from multiple dealers. Take your time to compare and choose the best deal!'}

© 2025 IQ Auto Deals
  `;

  await sendEmail({
    to: customerEmail,
    subject: `${isFirmPrice ? 'Firm Price: ' : 'New Offer on Your '}${car.year} ${car.make} ${car.model}!`,
    html,
    text,
  });
}

// Dealer notification when customer declines their offer
export async function sendDealerOfferDeclinedNotification(
  dealerEmail: string,
  dealerName: string,
  customerName: string,
  car: { year: number; make: string; model: string },
  offeredPrice: number
) {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://iqautodeals.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(to right, #6b7280, #374151);">
          <h1>Offer Declined</h1>
        </div>
        <div class="content">
          <p>Hi ${dealerName},</p>
          <p><strong>${customerName}</strong> has declined your offer on the following vehicle:</p>

          <div class="car-card" style="text-align: center;">
            <h3 style="margin: 0; color: #333;">${car.year} ${car.make} ${car.model}</h3>
            <p style="font-size: 24px; font-weight: bold; color: #6b7280; margin: 15px 0; text-decoration: line-through;">$${offeredPrice.toLocaleString()}</p>
            <p style="color: #dc2626; font-weight: bold;">DECLINED</p>
          </div>

          <div class="highlight" style="background: #fef2f2;">
            <p style="margin: 0;"><strong>What you can do:</strong></p>
            <ul style="margin: 10px 0 0;">
              <li>Consider submitting a more competitive offer if you have remaining offer slots</li>
              <li>The customer may be comparing offers from other dealers</li>
            </ul>
          </div>

          <p style="text-align: center;">
            <a href="${siteUrl}/dealer/negotiations" class="button">View Negotiations</a>
          </p>
        </div>
        <div class="footer">
          <p>© 2025 IQ Auto Deals. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Offer Declined - IQ Auto Deals

Hi ${dealerName},

${customerName} has declined your offer on the following vehicle:

${car.year} ${car.make} ${car.model}
Your Offer: $${offeredPrice.toLocaleString()} - DECLINED

What you can do:
- Consider submitting a more competitive offer if you have remaining offer slots
- The customer may be comparing offers from other dealers

View your negotiations: ${siteUrl}/dealer/negotiations

© 2025 IQ Auto Deals
  `;

  await sendEmail({
    to: dealerEmail,
    subject: `Offer Declined: ${car.year} ${car.make} ${car.model}`,
    html,
    text,
  });
}

// Dealer notification when customer cancels their deal
export async function sendDealerCustomerCancelledNotification(
  dealerEmail: string,
  dealerName: string,
  customerName: string,
  car: { year: number; make: string; model: string },
  wasAccepted: boolean
) {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://iqautodeals.com';

  const statusText = wasAccepted
    ? 'cancelled their accepted deal'
    : 'cancelled their deal request';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(to right, #dc2626, #f97316);">
          <h1>Deal Cancelled</h1>
        </div>
        <div class="content">
          <p>Hi ${dealerName},</p>
          <p><strong>${customerName}</strong> has ${statusText} on the following vehicle:</p>

          <div class="car-card" style="text-align: center;">
            <h3 style="margin: 0; color: #333;">${car.year} ${car.make} ${car.model}</h3>
            <p style="color: #dc2626; font-weight: bold; margin-top: 15px;">CANCELLED BY CUSTOMER</p>
          </div>

          ${wasAccepted ? `
          <div class="highlight" style="background: #fef2f2;">
            <p style="margin: 0;"><strong>Note:</strong> This was an accepted deal that the customer has now cancelled. The vehicle is available for other customers.</p>
          </div>
          ` : ''}

          <p style="text-align: center;">
            <a href="${siteUrl}/dealer/negotiations" class="button">View Negotiations</a>
          </p>
        </div>
        <div class="footer">
          <p>© 2025 IQ Auto Deals. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Deal Cancelled - IQ Auto Deals

Hi ${dealerName},

${customerName} has ${statusText} on the following vehicle:

${car.year} ${car.make} ${car.model}
CANCELLED BY CUSTOMER

${wasAccepted ? 'Note: This was an accepted deal that the customer has now cancelled. The vehicle is available for other customers.' : ''}

View your negotiations: ${siteUrl}/dealer/negotiations

© 2025 IQ Auto Deals
  `;

  await sendEmail({
    to: dealerEmail,
    subject: `Deal Cancelled: ${car.year} ${car.make} ${car.model}`,
    html,
    text,
  });
}

// Customer notification when dealer cancels a deal
export async function sendCustomerDealCancelledByDealerNotification(
  customerEmail: string,
  customerName: string,
  dealerName: string,
  car: { year: number; make: string; model: string }
) {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://iqautodeals.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(to right, #6b7280, #374151);">
          <h1>Deal Update</h1>
        </div>
        <div class="content">
          <p>Hi ${customerName},</p>
          <p>We wanted to let you know that <strong>${dealerName}</strong> has cancelled the deal on the following vehicle:</p>

          <div class="car-card" style="text-align: center;">
            <h3 style="margin: 0; color: #333;">${car.year} ${car.make} ${car.model}</h3>
            <p style="color: #6b7280; font-weight: bold; margin-top: 15px;">CANCELLED BY DEALER</p>
          </div>

          <div class="highlight" style="background: #e0f2fe;">
            <p style="margin: 0;"><strong>Don't worry!</strong> You still have other vehicles in your deal request, and there are many more great cars available on IQ Auto Deals.</p>
          </div>

          <p style="text-align: center;">
            <a href="${siteUrl}/customer/deals" class="button">View Your Deals</a>
          </p>
        </div>
        <div class="footer">
          <p>© 2025 IQ Auto Deals. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Deal Update - IQ Auto Deals

Hi ${customerName},

We wanted to let you know that ${dealerName} has cancelled the deal on the following vehicle:

${car.year} ${car.make} ${car.model}
CANCELLED BY DEALER

Don't worry! You still have other vehicles in your deal request, and there are many more great cars available on IQ Auto Deals.

View your deals: ${siteUrl}/customer/deals

© 2025 IQ Auto Deals
  `;

  await sendEmail({
    to: customerEmail,
    subject: `Deal Update: ${car.year} ${car.make} ${car.model}`,
    html,
    text,
  });
}
