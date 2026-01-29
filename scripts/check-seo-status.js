const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find Turpin Dodge dealership
  const dealership = await prisma.dealership.findFirst({
    where: {
      OR: [
        { name: { contains: 'Turpin', mode: 'insensitive' } },
        { name: { contains: 'Dodge', mode: 'insensitive' } },
      ]
    }
  });
  
  if (!dealership) {
    console.log('Turpin Dodge dealership not found');
    return;
  }
  
  console.log('Found dealership:', dealership.name, '(ID:', dealership.id, ')');
  
  // Get all vehicles/appraisals for this dealership
  const appraisals = await prisma.appraisal.findMany({
    where: { dealershipId: dealership.id },
    include: {
      vehicle: { select: { vin: true, year: true, make: true, model: true } },
      aiGeneratedContent: { 
        where: { contentType: 'LISTING_DESCRIPTION' },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });
  
  console.log('\n=== VEHICLES WITHOUT SEO DESCRIPTION ===');
  const withoutSeo = appraisals.filter(a => !a.aiGeneratedContent || a.aiGeneratedContent.length === 0);
  withoutSeo.forEach(a => {
    console.log(`${a.vehicle?.year} ${a.vehicle?.make} ${a.vehicle?.model} | VIN: ${a.vehicle?.vin?.slice(-8)}`);
  });
  console.log(`Total without SEO: ${withoutSeo.length}`);
  
  console.log('\n=== VEHICLES WITH SEO DESCRIPTION ===');
  const withSeo = appraisals.filter(a => a.aiGeneratedContent && a.aiGeneratedContent.length > 0);
  console.log(`Total with SEO: ${withSeo.length}`);
  
  // Check for recent AI content generation errors (last 24 hours)
  console.log('\n=== RECENT AI GENERATED CONTENT (Last 24h) ===');
  const recentContent = await prisma.aIGeneratedContent.findMany({
    where: {
      dealershipId: dealership.id,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    },
    include: {
      appraisal: { 
        include: { 
          vehicle: { select: { vin: true, year: true, make: true, model: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log(`Generated in last 24h: ${recentContent.length}`);
  recentContent.forEach(c => {
    const v = c.appraisal?.vehicle;
    console.log(`${c.createdAt.toISOString().substring(0, 16)} | ${c.contentType} | ${v?.year} ${v?.make} ${v?.model}`);
  });
  
  // Check usage logs for errors
  console.log('\n=== RECENT SHOWROOM AI USAGE LOGS ===');
  const usageLogs = await prisma.usageLog.findMany({
    where: {
      dealershipId: dealership.id,
      product: 'SHOWROOM_AI',
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  
  console.log(`Usage logs in last 24h: ${usageLogs.length}`);
}

main().finally(() => prisma.$disconnect());
