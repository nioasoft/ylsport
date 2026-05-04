import { PrismaClient, ProductSize } from "@prisma/client";

const prisma = new PrismaClient();

const initialInventory = [
  { size: ProductSize.S, totalStock: 180 },
  { size: ProductSize.M, totalStock: 180 },
  { size: ProductSize.L, totalStock: 60 },
  { size: ProductSize.XL, totalStock: 23 },
];

async function main() {
  console.log("🌱 Seeding size inventory...");

  for (const item of initialInventory) {
    const existing = await prisma.sizeInventory.findUnique({
      where: { size: item.size },
    });

    if (existing) {
      console.log(`  ⏭️  Size ${item.size} already exists (${existing.totalStock} units), skipping`);
      continue;
    }

    await prisma.sizeInventory.create({
      data: {
        size: item.size,
        totalStock: item.totalStock,
        reservedStock: 0,
        soldStock: 0,
        isActive: true,
      },
    });

    console.log(`  ✅ Size ${item.size}: ${item.totalStock} units`);
  }

  console.log("\n🎉 Inventory seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
