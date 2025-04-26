import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

export async function setupTestApp(): Promise<{
  app: INestApplication;
  prismaService: PrismaService;
  jwtService: JwtService;
  authToken: string;
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
  const jwtService = app.get<JwtService>(JwtService);

  // Ensure Prisma is connected
  try {
    // Test the connection
    await prismaService.$connect();

    // Clean database but preserve users
    await prismaService.cleanDatabasePreserveUsers();

    // Check if test user already exists before creating
    let user = await prismaService.userProfile.findUnique({
      where: { name: 'testuser' },
    });

    if (!user) {
      console.log('Creating test user...');
      const hashedPassword = await bcrypt.hash('testpassword', 10);
      user = await prismaService.userProfile.create({
        data: {
          name: 'testuser',
          password: hashedPassword,
        },
      });
      console.log('Test user created with ID:', user.id);
    } else {
      console.log('Using existing test user with ID:', user.id);
    }
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }

  // Generate auth token
  const authToken = await getAuthToken(jwtService, prismaService);

  return { app, prismaService, jwtService, authToken };
}

export async function getAuthToken(
  jwtService: JwtService,
  prismaService: PrismaService,
): Promise<string> {
  const user = await prismaService.userProfile.findUnique({
    where: { name: 'testuser' },
  });

  if (!user) {
    throw new Error('Test user not found');
  }

  console.log('User ID for token generation:', user.id);

  return jwtService.sign({ sub: user.id, name: user.name });
}
