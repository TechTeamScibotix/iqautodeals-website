const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCars() {
  const dealer = await prisma.user.findFirst({
    where: { name: { contains: 'Bryan' } },
    select: { id: true, name: true }
  });

  if (!dealer) {
    console.log('Dealer not found');
    return;
  }

  console.log('Dealer:', dealer.name, dealer.id);

  // Get ALL cars (any status) to find the 9 failed
  const cars = await prisma.car.findMany({
    where: {
      dealerId: dealer.id
    },
    select: {
      id: true,
      vin: true,
      year: true,
      make: true,
      model: true,
      color: true,
      mileage: true,
      city: true,
      state: true,
      status: true,
      description: true
    }
  });

  console.log('Total cars (all statuses):', cars.length);

  // Group by status
  const byStatus = {};
  cars.forEach(function(c) {
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
  });
  console.log('By status:', JSON.stringify(byStatus));

  // Find cars with EMPTY or very short descriptions (failed to generate)
  const emptyOrShort = cars.filter(function(c) {
    return !c.description || c.description.length < 100;
  });

  console.log('');
  console.log('=== Cars with EMPTY or SHORT descriptions (FAILED) ===');
  console.log('Count:', emptyOrShort.length);
  emptyOrShort.forEach(function(c) {
    console.log('- ' + c.year + ' ' + c.make + ' ' + c.model + ' (VIN: ' + c.vin + ')');
    var desc = c.description ? 'Length: ' + c.description.length + ' chars' : 'EMPTY';
    console.log('  ' + desc);
  });

  // Find cars with Certified/raw feed data in description (not AI generated)
  const rawFeed = cars.filter(function(c) {
    return c.description && (
      c.description.startsWith('Certified') ||
      c.description.includes('L/Certified') ||
      c.description.includes('\\n\\n') ||
      !c.description.includes('Looking for')
    );
  });

  console.log('');
  console.log('=== Cars with RAW FEED descriptions (not AI generated) ===');
  console.log('Count:', rawFeed.length);
  rawFeed.forEach(function(c) {
    console.log('- ' + c.year + ' ' + c.make + ' ' + c.model + ' (VIN: ' + c.vin + ')');
    console.log('  Description: ' + c.description.substring(0, 100) + '...');
  });

  // Find cars missing required fields for SEO generation
  const missingFields = cars.filter(function(c) {
    return !c.make || !c.model || !c.year || c.year === 0;
  });

  console.log('');
  console.log('=== Cars MISSING required fields (make/model/year) ===');
  console.log('Count:', missingFields.length);
  missingFields.forEach(function(c) {
    console.log('- VIN: ' + c.vin);
    console.log('  Make: ' + (c.make || 'MISSING') + ', Model: ' + (c.model || 'MISSING') + ', Year: ' + (c.year || 'MISSING'));
  });

  // Find cars without location info
  const missingLocation = cars.filter(function(c) {
    return !c.city || !c.state;
  });

  console.log('');
  console.log('=== Cars MISSING location (city/state) ===');
  console.log('Count:', missingLocation.length);
  missingLocation.slice(0, 10).forEach(function(c) {
    console.log('- ' + c.year + ' ' + c.make + ' ' + c.model + ' (VIN: ' + c.vin + ')');
    console.log('  City: ' + (c.city || 'MISSING') + ', State: ' + (c.state || 'MISSING'));
  });

  await prisma.$disconnect();
}

checkCars().catch(console.error);
