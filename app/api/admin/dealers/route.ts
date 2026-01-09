import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendDealerApprovalEmail, sendDealerRejectionEmail } from '@/lib/email';

// Get all dealers (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, approved, rejected, all

    const where: any = {
      userType: 'dealer',
    };

    if (status && status !== 'all') {
      where.verificationStatus = status;
    }

    const dealers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        businessName: true,
        websiteUrl: true,
        address: true,
        city: true,
        state: true,
        zip: true,
        verificationStatus: true,
        verificationNote: true,
        createdAt: true,
        // Sync fields
        inventoryFeedUrl: true,
        inventoryFeedType: true,
        autoSyncEnabled: true,
        syncFrequencyDays: true,
        lastSyncAt: true,
        lastSyncStatus: true,
        lastSyncMessage: true,
        _count: {
          select: {
            cars: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ dealers });
  } catch (error) {
    console.error('Error fetching dealers:', error);
    return NextResponse.json({ error: 'Failed to fetch dealers' }, { status: 500 });
  }
}

// Update dealer sync settings (PATCH for partial updates)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { dealerId, ...syncSettings } = body;

    if (!dealerId) {
      return NextResponse.json(
        { error: 'dealerId is required' },
        { status: 400 }
      );
    }

    // Only allow updating sync-related fields
    const allowedFields = [
      'inventoryFeedUrl',
      'inventoryFeedType',
      'autoSyncEnabled',
      'syncFrequencyDays',
      'websiteUrl',
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (field in syncSettings) {
        updateData[field] = syncSettings[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const dealer = await prisma.user.update({
      where: { id: dealerId },
      data: updateData,
      select: {
        id: true,
        businessName: true,
        inventoryFeedUrl: true,
        inventoryFeedType: true,
        autoSyncEnabled: true,
        syncFrequencyDays: true,
        lastSyncAt: true,
        lastSyncStatus: true,
        lastSyncMessage: true,
      },
    });

    return NextResponse.json({
      success: true,
      dealer,
      message: 'Sync settings updated'
    });
  } catch (error) {
    console.error('Error updating dealer sync settings:', error);
    return NextResponse.json({ error: 'Failed to update sync settings' }, { status: 500 });
  }
}

// Update dealer verification status
export async function PUT(request: NextRequest) {
  try {
    const { dealerId, verificationStatus, verificationNote } = await request.json();

    if (!dealerId || !verificationStatus) {
      return NextResponse.json(
        { error: 'dealerId and verificationStatus are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'approved', 'rejected'].includes(verificationStatus)) {
      return NextResponse.json(
        { error: 'Invalid verificationStatus. Must be pending, approved, or rejected' },
        { status: 400 }
      );
    }

    const dealer = await prisma.user.update({
      where: { id: dealerId },
      data: {
        verificationStatus,
        verificationNote: verificationNote || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        verificationStatus: true,
        verificationNote: true,
      },
    });

    // Send notification email based on status (fire and forget)
    if (verificationStatus === 'approved') {
      sendDealerApprovalEmail(dealer.email, dealer.businessName || dealer.name || 'Dealer').catch(err =>
        console.error('Failed to send dealer approval email:', err)
      );
    } else if (verificationStatus === 'rejected') {
      sendDealerRejectionEmail(
        dealer.email,
        dealer.businessName || dealer.name || 'Dealer',
        verificationNote
      ).catch(err => console.error('Failed to send dealer rejection email:', err));
    }

    return NextResponse.json({ dealer, message: `Dealer ${verificationStatus}` });
  } catch (error) {
    console.error('Error updating dealer:', error);
    return NextResponse.json({ error: 'Failed to update dealer' }, { status: 500 });
  }
}
