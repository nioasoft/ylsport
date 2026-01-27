const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting cleanup...');

  // Orders to KEEP
  const keepOrderNumbers = ['034', '035'];

  try {
    // 1. Delete Order Items first (due to foreign key constraints)
    const deleteItems = await prisma.orderItem.deleteMany({
      where: {
        order: {
          orderNumber: {
            notIn: keepOrderNumbers,
          },
        },
      },
    });
    console.log(`Deleted ${deleteItems.count} order items.`);

    // 2. Delete Exchange Requests linked to these orders
    const deleteExchanges = await prisma.exchangeRequest.deleteMany({
        where: {
            order: {
                orderNumber: {
                    notIn: keepOrderNumbers,
                }
            }
        }
    });
    console.log(`Deleted ${deleteExchanges.count} exchange requests.`);

    // 3. Delete Orders
    const deleteOrders = await prisma.order.deleteMany({
      where: {
        orderNumber: {
          notIn: keepOrderNumbers,
        },
      },
    });
    console.log(`Deleted ${deleteOrders.count} orders.`);

    console.log('Cleanup completed successfully.');
  } catch (error) {
    console.error('Error cleaning up orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
