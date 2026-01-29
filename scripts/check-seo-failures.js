require("dotenv").config();
require("dotenv").config({ path: ".env.local", override: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const dealerId = "e362433a-bfb0-49d4-80d0-d3361fd893a2"; // Nashville

  const total = await prisma.car.count({ where: { dealerId, status: "active" } });
  const withSEO = await prisma.car.count({ where: { dealerId, seoDescriptionGenerated: true } });

  const withoutSEO = await prisma.car.findMany({
    where: { dealerId, seoDescriptionGenerated: false, status: "active" },
    select: { id: true, vin: true, year: true, make: true, model: true, salePrice: true, photos: true },
    orderBy: { year: "desc" },
  });

  console.log("Total active cars:", total);
  console.log("Cars WITH SEO:", withSEO);
  console.log("Cars WITHOUT SEO (failed):", withoutSEO.length);

  let noPrice = 0, noPhotos = 0, noBoth = 0, complete = 0;

  console.log("\n--- FAILED CARS ---");
  for (const c of withoutSEO) {
    const hasPhotos = c.photos && c.photos !== "[]";
    const hasPrice = c.salePrice > 0;
    const price = hasPrice ? "$" + c.salePrice.toLocaleString() : "NO PRICE";
    const photos = hasPhotos ? "OK" : "NO PHOTOS";

    if (!hasPrice && !hasPhotos) noBoth++;
    else if (!hasPrice) noPrice++;
    else if (!hasPhotos) noPhotos++;
    else complete++;

    console.log(c.year + " " + c.make + " " + c.model + " | " + price + " | " + photos + " | " + c.vin);
  }

  console.log("\n--- SUMMARY ---");
  console.log("Missing BOTH price & photos:", noBoth);
  console.log("Missing only price:", noPrice);
  console.log("Missing only photos:", noPhotos);
  console.log("Complete data (likely API rate limit):", complete);

  await prisma.$disconnect();
}

main();
