import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import {
  sendCustomerWelcomeEmail,
  sendDealerWelcomeEmail,
  sendAdminNewDealerNotification,
} from '@/lib/email';

// Webhook to notify DealerHub/Scibotix of new dealer registrations
const DEALERHUB_WEBHOOK_URL = process.env.DEALERHUB_DEALER_WEBHOOK_URL || 'https://scibotixsolutions.com/api/webhooks/iqautodeals/dealer-registered';
const WEBHOOK_SECRET = process.env.IQAUTODEALS_WEBHOOK_SECRET;

async function notifyDealerHubNewDealer(dealer: {
  id: string;
  email: string;
  name: string;
  businessName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}) {
  if (!WEBHOOK_SECRET) {
    console.error('DealerHub dealer webhook skipped: IQAUTODEALS_WEBHOOK_SECRET not configured');
    return;
  }

  try {
    // Split name into first/last for the webhook
    const nameParts = (dealer.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const response = await fetch(DEALERHUB_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        iqautodealsUserId: dealer.id,
        email: dealer.email,
        dealershipName: dealer.businessName || dealer.name,
        firstName,
        lastName,
        phone: dealer.phone,
        address: dealer.address,
        city: dealer.city,
        state: dealer.state,
        zipCode: dealer.zip,
      }),
    });

    if (!response.ok) {
      console.error('DealerHub dealer webhook failed:', response.status, await response.text());
    } else {
      console.log('DealerHub dealer webhook success:', await response.json());
    }
  } catch (error) {
    console.error('DealerHub dealer webhook error:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password, name, userType, workDays, ...rest } = data;

    // Normalize email: trim whitespace and convert to lowercase
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password || !name || !userType) {
      return NextResponse.json({ error: 'Email, password, name, and user type are required' }, { status: 400 });
    }

    // Case-insensitive email check
    const existing = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive'
        }
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Set verification status for dealers
    const verificationStatus = userType === 'dealer' ? 'pending' : null;

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name,
        userType,
        verificationStatus,
        workDays: workDays ? JSON.stringify(workDays) : null,
        ...rest,
      },
    });

    // Send welcome emails (fire and forget - don't block registration)
    if (userType === 'customer') {
      sendCustomerWelcomeEmail(email, name).catch(err =>
        console.error('Failed to send customer welcome email:', err)
      );
    } else if (userType === 'dealer') {
      const businessName = rest.businessName || name || 'Dealer';
      sendDealerWelcomeEmail(email, businessName).catch(err =>
        console.error('Failed to send dealer welcome email:', err)
      );
      // Notify admin of new dealer registration via email
      sendAdminNewDealerNotification(email, businessName, name, rest.phone || null).catch(err =>
        console.error('Failed to send admin notification:', err)
      );
      // Notify DealerHub via webhook for admin dashboard
      notifyDealerHubNewDealer({
        id: user.id,
        email: user.email,
        name: user.name || name,
        businessName: user.businessName,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zip: user.zip,
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        verificationStatus: user.verificationStatus,
        businessName: user.businessName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
