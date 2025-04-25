/* eslint-disable @typescript-eslint/no-misused-promises */
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

// Explicitly type the PrismaClient instance
const prisma = new PrismaClient();

async function main() {
  // Seed Categories
  await prisma.category.createMany({
    data: [
      { name: 'Food' },
      { name: 'Salary' },
      { name: 'Transport' },
      { name: 'Entertainment' },
      { name: 'Bills' },
    ],
  });

  // Seed Wallets
  await prisma.wallet.createMany({
    data: [
      {
        name: 'Cash',
        initAmount: 500.0,
        currency: 'USD',
        visibleCategory: 'Food',
      },
      {
        name: 'Bank Account',
        initAmount: 2000.0,
        currency: 'USD',
        visibleCategory: null,
      },
      {
        name: 'Savings',
        initAmount: 10000.0,
        currency: 'USD',
        visibleCategory: 'Salary',
      },
    ],
  });

  // Seed Transactions
  await prisma.transaction.createMany({
    data: [
      {
        type: 'expense',
        amount: 25.5,
        currency: 'USD',
        date: '2025-04-01T12:30:00Z',
        walletId: 'Cash',
        categoryId: 'Food',
        repeat: 'None',
        note: 'Lunch at cafe',
        picture: null,
      },
      {
        type: 'income',
        amount: 1500.0,
        currency: 'USD',
        date: '2025-04-01T09:00:00Z',
        walletId: 'Bank Account',
        categoryId: 'Salary',
        repeat: 'monthly',
        note: 'Monthly salary',
        picture: null,
      },
      {
        type: 'expense',
        amount: 50.0,
        currency: 'USD',
        date: '2025-04-02T15:45:00Z',
        walletId: 'Bank Account',
        categoryId: 'Transport',
        repeat: 'None',
        note: 'Taxi ride',
        picture: '/images/taxi_receipt.jpg',
      },
      {
        type: 'expense',
        amount: 15.0,
        currency: 'USD',
        date: '2025-04-03T20:00:00Z',
        walletId: 'Cash',
        categoryId: 'Entertainment',
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
        walletId: 'Cash',
        repeat: 'monthly',
      },
      {
        name: 'Transport Budget',
        amount: 100.0,
        currency: 'USD',
        walletId: 'Bank Account',
        repeat: 'monthly',
      },
      {
        name: 'Annual Savings Goal',
        amount: 5000.0,
        currency: 'USD',
        walletId: 'Savings',
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
        categoryId: 'Entertainment',
      },
      {
        name: 'Internet',
        amount: 60.0,
        currency: 'USD',
        billingDate: '2025-04-28T00:00:00Z',
        repeat: 'monthly',
        reminderBefore: 0,
        categoryId: 'Bills',
      },
    ],
  });

  // Seed UserProfiles
  await prisma.userProfile.createMany({
    data: [
      {
        password: '$2b$10$exampleHashedPassword123',
        name: 'JohnDoe',
        avatar: '/images/john_doe_avatar.png',
      },
      {
        password: '$2b$10$anotherHashedPassword456',
        name: 'JaneSmith',
        avatar: null,
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
