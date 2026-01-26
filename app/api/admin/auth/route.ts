import { NextRequest, NextResponse } from 'next/server';

// Simple admin password authentication
// Set ADMIN_PASSWORD in your environment variables
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable not set');
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
    }

    if (password === adminPassword) {
      // Return a simple token (base64 of password for verification)
      const token = Buffer.from(password).toString('base64');
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

