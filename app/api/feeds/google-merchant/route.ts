import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Google Merchant Center Vehicle Ads Feed
// Documentation: https://support.google.com/merchants/answer/7552800

export async function GET() {
  try {
    // Fetch all active cars from approved dealers
    const cars = await prisma.car.findMany({
      where: {
        status: 'active',
        salePrice: { gt: 0 },
        dealer: {
          verificationStatus: 'approved',
        },
      },
      include: {
        dealer: {
          select: {
            id: true,
            businessName: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Build TSV (Tab-Separated Values) feed
    // Header row with required fields for Vehicle Ads
    const headers = [
      'id',
      'title',
      'description',
      'link',
      'image_link',
      'additional_image_link',
      'price',
      'condition',
      'availability',
      'brand',
      'vehicle_id',
      'make',
      'model',
      'year',
      'mileage',
      'color',
      'vehicle_fuel_type',
      'vehicle_transmission',
      'store_code',
      'google_product_category',
    ];

    const rows = [headers.join('\t')];

    for (const car of cars) {
      // Parse photos
      let photos: string[] = [];
      try {
        photos = car.photos ? JSON.parse(car.photos as string) : [];
      } catch {
        photos = [];
      }

      const mainImage = photos[0] || '';
      const additionalImages = photos.slice(1, 10).join(','); // Up to 10 additional images

      // Build car URL with slug or ID
      const carUrl = car.slug
        ? `https://iqautodeals.com/cars/${car.slug}`
        : `https://iqautodeals.com/cars/${car.id}`;

      // Create title (Year Make Model Trim)
      const title = [car.year, car.make, car.model, (car as any).trim]
        .filter(Boolean)
        .join(' ');

      // Create description
      const description = car.description
        ? car.description.substring(0, 5000).replace(/[\t\n\r]/g, ' ')
        : `${title} - ${car.mileage?.toLocaleString() || 0} miles, ${car.color || 'N/A'} exterior. Available at ${car.dealer.businessName} in ${car.city}, ${car.state}.`;

      // Format price (USD with cents)
      const price = `${car.salePrice?.toFixed(2) || '0.00'} USD`;

      // Determine condition based on mileage (rough heuristic)
      // Google requires: new, used, refurbished
      const condition = (car.mileage || 0) < 100 ? 'new' : 'used';

      // Map fuel type to Google's format
      const fuelTypeMap: Record<string, string> = {
        'Gasoline': 'gasoline',
        'Diesel': 'diesel',
        'Electric': 'electric',
        'Hybrid': 'hybrid',
        'Flex Fuel': 'flex_fuel',
        'Plug-In Hybrid': 'hybrid',
      };
      const fuelType = fuelTypeMap[(car as any).fuelType || 'Gasoline'] || 'gasoline';

      // Map transmission
      const transmissionMap: Record<string, string> = {
        'Automatic': 'automatic',
        'Manual': 'manual',
        'CVT': 'automatic',
      };
      const transmission = transmissionMap[car.transmission || 'Automatic'] || 'automatic';

      // Build row
      const row = [
        car.vin, // id (use VIN for uniqueness)
        title,
        description,
        carUrl,
        mainImage,
        additionalImages,
        price,
        condition,
        'in_stock', // availability
        car.make, // brand
        car.vin, // vehicle_id
        car.make,
        car.model,
        car.year,
        `${car.mileage || 0} mi`,
        car.color || '',
        fuelType,
        transmission,
        car.dealer.id, // store_code (dealer ID)
        '916', // Google product category for Vehicles
      ];

      // Escape tabs in values and join
      const escapedRow = row.map(val =>
        String(val || '').replace(/[\t\n\r]/g, ' ')
      );

      rows.push(escapedRow.join('\t'));
    }

    const tsvContent = rows.join('\n');

    // Return as TSV file
    return new NextResponse(tsvContent, {
      headers: {
        'Content-Type': 'text/tab-separated-values; charset=utf-8',
        'Content-Disposition': 'attachment; filename="google-merchant-feed.tsv"',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating Google Merchant feed:', error);
    return NextResponse.json(
      { error: 'Failed to generate feed' },
      { status: 500 }
    );
  }
}
