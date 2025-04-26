import { PrismaClient } from '@prisma/client';

// Load environment variables from .env.test
process.env.NODE_ENV = 'test';

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

const prisma = new PrismaClient();

// Connect to database and perform any setup before all tests run
beforeAll(async () => {
  try {
    await prisma.$connect();
    console.log('Connected to test database successfully');
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }
});

// Disconnect and clean everything after all test suites are done
afterAll(async () => {
  try {
    console.log(
      'Running global cleanup, removing all test data including users',
    );
    // Define cleanup tables
    const tablenames = [
      'Transaction',
      'Budget',
      'Subscription',
      'Wallet',
      'Category',
      'UserProfile',
    ];

    for (const table of tablenames) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    }

    await prisma.$disconnect();
    console.log('Disconnected from test database successfully');
  } catch (error) {
    console.error('Error disconnecting from test database:', error);
  }
});

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
