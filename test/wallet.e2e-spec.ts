import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { setupTestApp } from './test-utils';

describe('WalletController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let walletId: string;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    prismaService = setup.prismaService;
    authToken = setup.authToken;

    // Clean up before starting but preserve users
    await prismaService.cleanDatabasePreserveUsers();
  });

  afterEach(async () => {
    await prismaService.wallet.deleteMany({
      where: {
        name: {
          contains: 'Test',
        },
      },
    });
  });

  afterAll(async () => {
    await prismaService.cleanDatabasePreserveUsers();
    await app.close();
  });

  it('/wallets (POST) - creates a new wallet', async () => {
    // create a category
    await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'TestCategory1',
      })
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/wallets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'TestWallet1',
        initAmount: 1000,
        currency: 'USD',
        visibleCategory: 'TestCategory1',
      })
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('name', 'TestWallet1');
    walletId = response.body.id;
  });

  it('/wallets (GET) - returns all wallets', async () => {
    // create a category
    await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'TestCategory2',
      })
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post('/wallets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'TestWallet2',
        initAmount: 2000,
        currency: 'USD',
        visibleCategory: 'TestCategory2',
      })
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .get('/wallets')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((w) => w.name === 'TestWallet2')).toBe(true);
  });

  it('/wallets/:name (GET) - returns a specific wallet', async () => {
    // create a category
    await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'TestCategory3',
      })
      .expect(HttpStatus.CREATED);

    const createRes = await request(app.getHttpServer())
      .post('/wallets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'TestWallet3',
        initAmount: 3000,
        currency: 'USD',
        visibleCategory: 'TestCategory3',
      })
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .get(`/wallets/${createRes.body.name}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('name', 'TestWallet3');
  });

  it('/wallets/:name (PUT) - updates a wallet', async () => {
    // create a category
    await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'TestCategory4',
      })
      .expect(HttpStatus.CREATED);

    const createRes = await request(app.getHttpServer())
      .post('/wallets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'TestWallet4',
        initAmount: 4000,
        currency: 'USD',
        visibleCategory: 'TestCategory4',
      })
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .put(`/wallets/${createRes.body.name}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'TestWallet4Updated',
        initAmount: 4500,
        currency: 'USD',
      })
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('name', 'TestWallet4Updated');
  });

  it('/wallets/:name (DELETE) - deletes a wallet', async () => {
    // create a category
    await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'TestCategory5',
      })
      .expect(HttpStatus.CREATED);

    const createRes = await request(app.getHttpServer())
      .post('/wallets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'TestWallet5',
        initAmount: 5000,
        currency: 'USD',
        visibleCategory: 'TestCategory5',
      })
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .delete(`/wallets/${createRes.body.name}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NO_CONTENT);

    // Verify deletion
    await request(app.getHttpServer())
      .get(`/wallets/${createRes.body.name}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
