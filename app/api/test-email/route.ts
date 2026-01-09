import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to') || 'noreply@iqautodeals.com';

  try {
    await sendEmail({
      to,
      subject: `Test Email from Vercel - ${new Date().toISOString()}`,
      html: `<h1>Test Email</h1><p>This is a test email sent from the Vercel deployment at ${new Date().toISOString()}</p>`,
      text: `Test Email - Sent from Vercel at ${new Date().toISOString()}`,
    });

    return NextResponse.json({
      success: true,
      message: `Email sent to ${to}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Test email failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
