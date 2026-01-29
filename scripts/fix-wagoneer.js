const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find the car with missing make
  const car = await prisma.car.findFirst({
    where: {
      vin: { endsWith: 'TS154583' }
    }
  });

  if (!car) {
    console.log('Car not found');
    return;
  }

  console.log('Found car:', car.year, car.make, car.model, '| VIN:', car.vin);
  console.log('Current make:', car.make || '(empty)');

  // Update the make to Jeep
  const updated = await prisma.car.update({
    where: { id: car.id },
    data: { make: 'Jeep' }
  });

  console.log('Updated make to:', updated.make);
  console.log('Car ID:', car.id);

  // Now generate SEO description
  const seoDescription = `Looking for a 2026 Jeep Grand Wagoneer for sale? This stunning full-size luxury SUV delivers an exceptional combination of premium craftsmanship, advanced technology, and commanding presence. The Jeep Grand Wagoneer offers best-in-class passenger space and cargo capacity, making it perfect for families who demand both luxury and versatility.

Step inside and experience the refined interior featuring premium materials, a state-of-the-art Uconnect infotainment system, and available McIntosh audio. With powerful engine options and legendary Jeep 4x4 capability, this 2026 Grand Wagoneer is ready for any adventure while providing the comfort and sophistication you expect from a flagship luxury SUV.

Don't miss your opportunity to own this exceptional 2026 Jeep Grand Wagoneer. Contact us today to schedule your test drive and discover why the Grand Wagoneer continues to set the standard for American luxury.`;

  // Update with SEO description
  const finalUpdate = await prisma.car.update({
    where: { id: car.id },
    data: { description: seoDescription }
  });

  console.log('\nSEO Description added successfully!');
  console.log('Description length:', finalUpdate.description.length, 'characters');
}

main().finally(() => prisma.$disconnect());
