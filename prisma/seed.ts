import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  console.log("Creating admin user...");
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
  const passwordHash = await hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
    },
  });
  console.log(`✓ Created admin user: ${admin.username}`);

  // Create sample discount codes
  console.log("Creating sample discount codes...");

  const discounts = [
    {
      code: "YL10",
      type: "PERCENTAGE" as const,
      value: 10,
      validFrom: new Date(),
      validUntil: new Date("2099-12-31"),
      usageLimit: null,
      minimumOrderValue: null,
      isActive: true,
    },
    {
      code: "LAUNCH50",
      type: "FIXED_AMOUNT" as const,
      value: 50,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      usageLimit: 100,
      minimumOrderValue: null,
      isActive: true,
    },
    {
      code: "WELCOME10",
      type: "PERCENTAGE" as const,
      value: 10,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      usageLimit: null,
      minimumOrderValue: null,
      isActive: true,
    },
  ];

  for (const discount of discounts) {
    const created = await prisma.discountCode.upsert({
      where: { code: discount.code },
      update: {},
      create: discount,
    });
    console.log(`✓ Created discount code: ${created.code} (${created.type})`);
  }

  console.log("✅ Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
