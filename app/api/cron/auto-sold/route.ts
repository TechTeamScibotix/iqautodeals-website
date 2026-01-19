import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Cron job to automatically mark "sale pending" listings as "sold" after 3 days
// This should be called by Vercel Cron or similar scheduler

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate the date 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Find all cars with "sold" status where statusChangedAt is more than 3 days ago
    // "sale pending" = car.status is 'sold' but acceptedDeal.sold is false
    const carsToUpdate = await prisma.car.findMany({
      where: {
        status: 'sold',
        statusChangedAt: {
          lt: threeDaysAgo,
          not: null,
        },
      },
      include: {
        acceptedDeals: true,
      },
    });

    // Filter to only those that are "sale pending" (acceptedDeal.sold = false)
    const salePendingCars = carsToUpdate.filter(car => {
      // Check if any accepted deal is not yet marked as sold
      return car.acceptedDeals.some(deal => !deal.sold && !deal.deadDeal && !deal.cancelledByCustomer);
    });

    let updatedCount = 0;

    // Mark the accepted deals as sold
    for (const car of salePendingCars) {
      for (const acceptedDeal of car.acceptedDeals) {
        if (!acceptedDeal.sold && !acceptedDeal.deadDeal && !acceptedDeal.cancelledByCustomer) {
          await prisma.acceptedDeal.update({
            where: { id: acceptedDeal.id },
            data: { sold: true },
          });
          updatedCount++;
        }
      }
    }

    console.log(`[Auto-Sold Cron] Marked ${updatedCount} deals as sold after 3 days`);

    return NextResponse.json({
      success: true,
      message: `Marked ${updatedCount} sale pending listings as sold`,
      processed: salePendingCars.length,
      updated: updatedCount,
    });
  } catch (error) {
    console.error('[Auto-Sold Cron] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process auto-sold' },
      { status: 500 }
    );
  }
}
