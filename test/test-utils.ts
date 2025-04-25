import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

export async function setupTestApp(): Promise<{
  app: INestApplication;
  prismaService: PrismaService;
}> {
  // Ensure NODE_ENV is set to 'test'
  process.env.NODE_ENV = 'test';

  // Create the test module
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  const prismaService = app.get<PrismaService>(PrismaService);

  // Ensure Prisma is connected
  try {
    // Test the connection
    await prismaService.$connect();

    // Clear database tables
    await prismaService.cleanDatabase();
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }

  return { app, prismaService };
}
