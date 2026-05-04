import { prisma } from "@/lib/prisma";
import { ProductSize } from "@prisma/client";

/**
 * Get available stock for a given size.
 * available = totalStock - reservedStock - soldStock
 */
export async function getAvailableStock(size: ProductSize): Promise<number> {
  const inventory = await prisma.sizeInventory.findUnique({
    where: { size },
  });

  if (!inventory || !inventory.isActive) return 0;

  return Math.max(0, inventory.totalStock - inventory.reservedStock - inventory.soldStock);
}

/**
 * Get available stock for ALL sizes.
 */
export async function getAllStock(): Promise<
  Record<ProductSize, { available: number; total: number; reserved: number; sold: number; isActive: boolean }>
> {
  const inventories = await prisma.sizeInventory.findMany();

  const result = {} as Record<
    ProductSize,
    { available: number; total: number; reserved: number; sold: number; isActive: boolean }
  >;

  // Initialize defaults
  for (const size of [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL]) {
    result[size] = { available: 0, total: 0, reserved: 0, sold: 0, isActive: false };
  }

  for (const inv of inventories) {
    const available = Math.max(0, inv.totalStock - inv.reservedStock - inv.soldStock);
    result[inv.size] = {
      available,
      total: inv.totalStock,
      reserved: inv.reservedStock,
      sold: inv.soldStock,
      isActive: inv.isActive,
    };
  }

  return result;
}

/**
 * Reserve stock for an order (called when order is PAID).
 * Uses a transaction to prevent race conditions.
 */
export async function reserveStock(size: ProductSize, quantity: number): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const inventory = await tx.sizeInventory.findUnique({ where: { size } });

    if (!inventory || !inventory.isActive) return false;

    const available = inventory.totalStock - inventory.reservedStock - inventory.soldStock;
    if (available < quantity) return false;

    await tx.sizeInventory.update({
      where: { size },
      data: { reservedStock: { increment: quantity } },
    });

    return true;
  });
}

/**
 * Release reserved stock (called on CANCELLED / REFUNDED).
 */
export async function releaseStock(size: ProductSize, quantity: number): Promise<void> {
  await prisma.sizeInventory.update({
    where: { size },
    data: {
      reservedStock: { decrement: Math.min(quantity, (await prisma.sizeInventory.findUnique({ where: { size } }))!.reservedStock) },
    },
  });
}

/**
 * Convert reserved to sold (called on SHIPPED / DELIVERED).
 */
export async function confirmSale(size: ProductSize, quantity: number): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.sizeInventory.update({
      where: { size },
      data: {
        reservedStock: { decrement: quantity },
        soldStock: { increment: quantity },
      },
    });
  });
}
