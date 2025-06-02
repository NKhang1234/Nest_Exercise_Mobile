/* eslint-disable @typescript-eslint/no-misused-promises */
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.userProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.wallet.deleteMany();
  // Seed UserProfiles
  const user = await prisma.userProfile.create({
    data: {
      password: '$2b$10$exampleHashedPassword123',
      name: 'JohnDoe',
      avatar: '/images/john_doe_avatar.png',
    },
  });

  // Seed Categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Food', userId: user.id },
      { name: 'Salary', userId: user.id },
      { name: 'Transport', userId: user.id },
      { name: 'Entertainment', userId: user.id },
      { name: 'Bills', userId: user.id },
    ],
  });

  // Fetch categories with their IDs
  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany({ where: { userId: user.id } })).map(
      (c) => [c.name, c.id],
    ),
  );

  // Seed Wallets
  await prisma.wallet.createMany({
    data: [
      {
        name: 'Cash',
        initAmount: 500.0,
        currency: 'USD',
        visibleCategory: categoryMap['Food'],
        userId: user.id,
      },
      {
        name: 'Bank Account',
        initAmount: 2000.0,
        currency: 'USD',
        visibleCategory: null,
        userId: user.id,
      },
      {
        name: 'Savings',
        initAmount: 10000.0,
        currency: 'USD',
        visibleCategory: categoryMap['Salary'],
        userId: user.id,
      },
    ],
  });

  // Fetch wallets with their IDs
  const walletMap = Object.fromEntries(
    (await prisma.wallet.findMany({ where: { userId: user.id } })).map((w) => [
      w.name,
      w.id,
    ]),
  );

  // Seed Transactions
  await prisma.transaction.createMany({
    data: [
      {
        type: 'expense',
        amount: 25.5,
        currency: 'USD',
        date: '2025-04-01T12:30:00Z',
        walletId: walletMap['Cash'],
        categoryId: categoryMap['Food'],
        userId: user.id,
        repeat: 'None',
        note: 'Lunch at cafe',
        picture: null,
      },
      {
        type: 'income',
        amount: 1500.0,
        currency: 'USD',
        date: '2025-04-01T09:00:00Z',
        walletId: walletMap['Bank Account'],
        categoryId: categoryMap['Salary'],
        userId: user.id,
        repeat: 'monthly',
        note: 'Monthly salary',
        picture: null,
      },
      {
        type: 'expense',
        amount: 50.0,
        currency: 'USD',
        date: '2025-04-02T15:45:00Z',
        walletId: walletMap['Bank Account'],
        categoryId: categoryMap['Transport'],
        userId: user.id,
        repeat: 'None',
        note: 'Taxi ride',
        picture: '/images/taxi_receipt.jpg',
      },
      {
        type: 'expense',
        amount: 15.0,
        currency: 'USD',
        date: '2025-04-03T20:00:00Z',
        walletId: walletMap['Cash'],
        categoryId: categoryMap['Entertainment'],
        userId: user.id,
        repeat: 'None',
        note: 'Movie ticket',
        picture: null,
      },
    ],
  });

  // Seed Budgets
  await prisma.budget.createMany({
    data: [
      {
        name: 'Monthly Food Budget',
        amount: 300.0,
        currency: 'USD',
        walletId: walletMap['Cash'],
        userId: user.id,
        repeat: 'monthly',
      },
      {
        name: 'Transport Budget',
        amount: 100.0,
        currency: 'USD',
        walletId: walletMap['Bank Account'],
        userId: user.id,
        repeat: 'monthly',
      },
      {
        name: 'Annual Savings Goal',
        amount: 5000.0,
        currency: 'USD',
        walletId: walletMap['Savings'],
        userId: user.id,
        repeat: 'yearly',
      },
    ],
  });

  // Seed Subscriptions
  await prisma.subscription.createMany({
    data: [
      {
        name: 'Netflix',
        amount: 15.99,
        currency: 'USD',
        billingDate: '2025-05-01T00:00:00Z',
        repeat: 'monthly',
        reminderBefore: 1440,
        categoryId: categoryMap['Entertainment'],
        userId: user.id,
      },
      {
        name: 'Internet',
        amount: 60.0,
        currency: 'USD',
        billingDate: '2025-04-28T00:00:00Z',
        repeat: 'monthly',
        reminderBefore: 0,
        categoryId: categoryMap['Bills'],
        userId: user.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
