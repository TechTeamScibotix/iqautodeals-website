import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/google-calendar';

// GET - Get available time slots for booking
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get('startDate');
    const daysStr = searchParams.get('days');

    const startDate = startDateStr ? new Date(startDateStr) : undefined;
    const days = daysStr ? parseInt(daysStr, 10) : 14;

    const slots = await getAvailableSlots(startDate, days);

    return NextResponse.json({ slots });
  } catch (error) {
    console.error('[Book Demo] Error getting availability:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get availability' },
      { status: 500 }
    );
  }
}
