import { NextRequest, NextResponse } from 'next/server';
import zipcodes from 'zipcodes';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Invalid lat/lng' }, { status: 400 });
  }

  const result = zipcodes.lookupByCoords(lat, lng);
  if (!result) {
    return NextResponse.json({ error: 'No ZIP found' }, { status: 404 });
  }

  return NextResponse.json({ zip: result.zip, city: result.city, state: result.state });
}
