import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dealerId, carId, referrerPage } = body;

    if (!dealerId || !carId) {
      return NextResponse.json({ ok: true });
    }

    const userAgent = req.headers.get('user-agent') || undefined;

    // Privacy-safe IP hashing — never store raw IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    const ipHash = createHash('sha256').update(ip).digest('hex').slice(0, 16);

    await prisma.dealerWebsiteClick.create({
      data: {
        dealerId,
        carId,
        userAgent,
        ipHash,
        referrerPage: referrerPage || undefined,
      },
    });
  } catch {
    // Tracking should never fail visibly
  }

  return NextResponse.json({ ok: true });
}
