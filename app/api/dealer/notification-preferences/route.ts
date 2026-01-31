import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Return team members and current notification preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get('dealerId');

    if (!dealerId) {
      return NextResponse.json(
        { error: 'Dealer ID is required' },
        { status: 400 }
      );
    }

    // Get the user to check if they're an owner or team member
    const user = await prisma.user.findUnique({
      where: { id: dealerId },
      select: {
        id: true,
        parentDealerId: true,
        userType: true,
      },
    });

    if (!user || user.userType !== 'dealer') {
      return NextResponse.json(
        { error: 'Dealer not found' },
        { status: 404 }
      );
    }

    // Get the parent dealer ID (for team members, use their parent)
    const parentDealerId = user.parentDealerId || user.id;

    // Get the parent dealer with team members and preferences
    const parentDealer = await prisma.user.findUnique({
      where: { id: parentDealerId },
      include: {
        teamMembers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        notificationPreferences: true,
      },
    });

    if (!parentDealer) {
      return NextResponse.json(
        { error: 'Parent dealer not found' },
        { status: 404 }
      );
    }

    const preferences = parentDealer.notificationPreferences;

    return NextResponse.json({
      teamMembers: parentDealer.teamMembers,
      preferences: preferences ? {
        availabilityRecipients: preferences.availabilityRecipients,
        dealRequestRecipients: preferences.dealRequestRecipients,
        offerDeclinedRecipients: preferences.offerDeclinedRecipients,
        dealCancelledRecipients: preferences.dealCancelledRecipients,
        alwaysNotifyOwner: preferences.alwaysNotifyOwner,
      } : {
        availabilityRecipients: [],
        dealRequestRecipients: [],
        offerDeclinedRecipients: [],
        dealCancelledRecipients: [],
        alwaysNotifyOwner: true,
      },
      isOwner: !user.parentDealerId,
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    );
  }
}

// PUT - Save notification preferences (only OWNER can modify)
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      dealerId,
      availabilityRecipients,
      dealRequestRecipients,
      offerDeclinedRecipients,
      dealCancelledRecipients,
      alwaysNotifyOwner,
    } = data;

    if (!dealerId) {
      return NextResponse.json(
        { error: 'Dealer ID is required' },
        { status: 400 }
      );
    }

    // Get the user to check if they're an owner
    const user = await prisma.user.findUnique({
      where: { id: dealerId },
      select: {
        id: true,
        parentDealerId: true,
        userType: true,
      },
    });

    if (!user || user.userType !== 'dealer') {
      return NextResponse.json(
        { error: 'Dealer not found' },
        { status: 404 }
      );
    }

    // Only owners can modify notification preferences
    if (user.parentDealerId) {
      return NextResponse.json(
        { error: 'Only the account owner can modify notification preferences' },
        { status: 403 }
      );
    }

    // Validate that recipient IDs are valid team member IDs
    const teamMembers = await prisma.user.findMany({
      where: {
        parentDealerId: dealerId,
      },
      select: {
        id: true,
      },
    });

    const validTeamMemberIds = new Set(teamMembers.map(tm => tm.id));

    const validateRecipients = (recipients: string[]) => {
      if (!Array.isArray(recipients)) return [];
      return recipients.filter(id => validTeamMemberIds.has(id));
    };

    const validatedPreferences = {
      availabilityRecipients: validateRecipients(availabilityRecipients || []),
      dealRequestRecipients: validateRecipients(dealRequestRecipients || []),
      offerDeclinedRecipients: validateRecipients(offerDeclinedRecipients || []),
      dealCancelledRecipients: validateRecipients(dealCancelledRecipients || []),
      alwaysNotifyOwner: alwaysNotifyOwner !== false, // Default to true
    };

    // Upsert the notification preferences
    const preferences = await prisma.notificationPreference.upsert({
      where: {
        dealerId: dealerId,
      },
      update: validatedPreferences,
      create: {
        dealerId: dealerId,
        ...validatedPreferences,
      },
    });

    return NextResponse.json({
      success: true,
      preferences: {
        availabilityRecipients: preferences.availabilityRecipients,
        dealRequestRecipients: preferences.dealRequestRecipients,
        offerDeclinedRecipients: preferences.offerDeclinedRecipients,
        dealCancelledRecipients: preferences.dealCancelledRecipients,
        alwaysNotifyOwner: preferences.alwaysNotifyOwner,
      },
    });
  } catch (error) {
    console.error('Error saving notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save notification preferences' },
      { status: 500 }
    );
  }
}
