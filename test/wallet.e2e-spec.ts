import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { setupTestApp } from './test-utils';

describe('WalletController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string; // Add this to store the auth token

  beforeAll(async () => {
    try {
      const setup = await setupTestApp();
      app = setup.app;
      prismaService = setup.prismaService;
      authToken = setup.authToken; // Get the auth token from setup

      // Clean up before starting tests but preserve users
      await prismaService.cleanDatabasePreserveUsers();

      // Create a test category for wallet relationships
      await prismaService.category.create({
        data: { name: 'TestCategory' },
      });
    } catch (error) {
      console.error('Error in beforeAll:', error);
      throw error;
    }
  });

  // Clean up after each test to ensure isolation
  afterEach(async () => {
    try {
      // Clean out all wallets except 'TestCategory'
      await prismaService.wallet.deleteMany({
        where: {
          name: {
            contains: 'Test',
          },
        },
      });
    } catch (error) {
      console.error('Error in afterEach cleanup:', error);
    }
  });

  afterAll(async () => {
    try {
      // Clean up database but preserve users
      await prismaService.cleanDatabasePreserveUsers();
      await app.close();
    } catch (error) {
      console.error('Error in afterAll cleanup:', error);
    }
  });

  // Individual tests with better error handling
  it('/wallets (POST) - creates a new wallet', async () => {
    try {
      // Fix: Ensure the Bearer token has proper formatting
      const response = await request(app.getHttpServer())
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'TestWallet1',
          initAmount: 1000,
          currency: 'USD',
          visibleCategory: 'TestCategory',
        })
        .expect(201);

      expect(response.body).toHaveProperty('name', 'TestWallet1');
      expect(response.body).toHaveProperty('initAmount', 1000);
      expect(response.body).toHaveProperty('currency', 'USD');
      expect(response.body).toHaveProperty('visibleCategory', 'TestCategory');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  it('/wallets (POST) - creates a wallet without visible category', async () => {
    try {
      const response = await request(app.getHttpServer())
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .send({
          name: 'TestWallet2',
          initAmount: 500,
          currency: 'EUR',
        })
        .expect(201);

      expect(response.body).toHaveProperty('name', 'TestWallet2');
      expect(response.body).toHaveProperty('initAmount', 500);
      expect(response.body).toHaveProperty('currency', 'EUR');
      expect(response.body.visibleCategory).toBeNull();
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  it('/wallets (GET) - returns all wallets', async () => {
    try {
      // Create test data through API
      await request(app.getHttpServer())
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .send({
          name: 'TestWallet3',
          initAmount: 300,
          currency: 'USD',
          visibleCategory: 'TestCategory',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .send({
          name: 'TestWallet4',
          initAmount: 400,
          currency: 'EUR',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/wallets')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      const wallet3 = response.body.find((w) => w.name === 'TestWallet3');
      const wallet4 = response.body.find((w) => w.name === 'TestWallet4');

      expect(wallet3).toBeTruthy();
      expect(wallet4).toBeTruthy();
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  it('/wallets/:name (GET) - returns a specific wallet', async () => {
    try {
      // Create test data
      await request(app.getHttpServer())
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .send({
          name: 'TestWallet5',
          initAmount: 250,
          currency: 'GBP',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/wallets/TestWallet5')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .expect(200);

      expect(response.body).toHaveProperty('name', 'TestWallet5');
      expect(response.body).toHaveProperty('initAmount', 250);
      expect(response.body).toHaveProperty('currency', 'GBP');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  it('/wallets/:name (GET) - returns 404 for non-existent wallet', async () => {
    try {
      await request(app.getHttpServer())
        .get('/wallets/NonExistentWallet')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .expect(404);
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  it('/wallets/:name (PUT) - updates a wallet', async () => {
    try {
      // Create test data with a unique name for this test
      const createResponse = await request(app.getHttpServer())
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .send({
          name: 'TestWalletForUpdate',
          initAmount: 100,
          currency: 'USD',
        })
        .expect(201);

      expect(createResponse.body).toHaveProperty('name', 'TestWalletForUpdate');

      const updateResponse = await request(app.getHttpServer())
        .put('/wallets/TestWalletForUpdate')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .send({
          name: 'TestWalletUpdated',
          initAmount: 150,
          currency: 'EUR',
          visibleCategory: 'TestCategory',
        })
        .expect(200);

      expect(updateResponse.body).toHaveProperty('name', 'TestWalletUpdated');
      expect(updateResponse.body).toHaveProperty('initAmount', 150);
      expect(updateResponse.body).toHaveProperty('currency', 'EUR');
      expect(updateResponse.body).toHaveProperty(
        'visibleCategory',
        'TestCategory',
      );
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  it('/wallets/:name (DELETE) - deletes a wallet', async () => {
    try {
      // Create test data with a unique name for this test
      await request(app.getHttpServer())
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .send({
          name: 'TestWalletToDelete',
          initAmount: 200,
          currency: 'USD',
        })
        .expect(201);

      // Delete wallet
      await request(app.getHttpServer())
        .delete('/wallets/TestWalletToDelete')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .expect(204);

      // Verify deletion
      await request(app.getHttpServer())
        .get('/wallets/TestWalletToDelete')
        .set('Authorization', `Bearer ${authToken}`) // Add this line
        .expect(404);
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
