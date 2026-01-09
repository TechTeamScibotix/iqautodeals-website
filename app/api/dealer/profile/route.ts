import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get('dealerId');

    if (!dealerId) {
      return NextResponse.json({ error: 'Dealer ID required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: dealerId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        businessName: true,
        websiteUrl: true,
        showCustomMessage: true,
        availabilityMessage: true,
        address: true,
        city: true,
        state: true,
        zip: true,
        workHoursStart: true,
        workHoursEnd: true,
        workDays: true,
        verificationStatus: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { dealerId, workDays, ...rest } = data;

    if (!dealerId) {
      return NextResponse.json({ error: 'Dealer ID required' }, { status: 400 });
    }

    // Only allow updating specific fields
    const allowedFields = [
      'name',
      'phone',
      'businessName',
      'websiteUrl',
      'showCustomMessage',
      'availabilityMessage',
      'address',
      'city',
      'state',
      'zip',
      'workHoursStart',
      'workHoursEnd',
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (rest[field] !== undefined) {
        updateData[field] = rest[field];
      }
    }

    // Handle workDays separately (stored as JSON string)
    if (workDays !== undefined) {
      updateData.workDays = JSON.stringify(workDays);
    }

    const user = await prisma.user.update({
      where: { id: dealerId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        businessName: true,
        websiteUrl: true,
        showCustomMessage: true,
        availabilityMessage: true,
        address: true,
        city: true,
        state: true,
        zip: true,
        workHoursStart: true,
        workHoursEnd: true,
        workDays: true,
        verificationStatus: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
