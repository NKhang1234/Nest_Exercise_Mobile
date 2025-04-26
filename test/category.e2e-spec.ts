import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { setupTestApp } from './test-utils';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    try {
      const setup = await setupTestApp();
      app = setup.app;
      prismaService = setup.prismaService;
      authToken = setup.authToken;

      // Clean up before starting but preserve users
      await prismaService.cleanDatabasePreserveUsers();
    } catch (error) {
      console.error('Error in beforeAll:', error);
      throw error;
    }
  });

  // Clean up after each test to ensure isolation
  afterEach(async () => {
    try {
      await prismaService.category.deleteMany({
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

  it('/categories (POST) - creates a new category', async () => {
    try {
      // Fix: Ensure the Bearer token has proper formatting
      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'TestCategory1' })
        .expect(201);

      expect(response.body).toHaveProperty('name', 'TestCategory1');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  it('/categories (GET) - returns all categories', async () => {
    try {
      // Create test data through API
      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'TestCategory2' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'TestCategory3' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      const cat2 = response.body.find((c) => c.name === 'TestCategory2');
      const cat3 = response.body.find((c) => c.name === 'TestCategory3');

      expect(cat2).toBeTruthy();
      expect(cat3).toBeTruthy();
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  it('/categories/:name (GET) - returns a specific category', async () => {
    try {
      // Create test data
      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'TestCategory4' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/categories/TestCategory4')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('name', 'TestCategory4');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  it('/categories/:name (GET) - returns 404 for non-existent category', async () => {
    try {
      await request(app.getHttpServer())
        .get('/categories/NonExistentCategory')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  it('/categories/:name (PUT) - updates a category', async () => {
    try {
      // Create test data
      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'TestCategory5' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .put('/categories/TestCategory5')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'TestCategoryUpdated' })
        .expect(200);

      expect(response.body).toHaveProperty('name', 'TestCategoryUpdated');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  it('/categories/:name (DELETE) - deletes a category', async () => {
    try {
      // Create test data
      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'TestCategoryToDelete' })
        .expect(201);

      // Delete category
      await request(app.getHttpServer())
        .delete('/categories/TestCategoryToDelete')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify deletion
      await request(app.getHttpServer())
        .get('/categories/TestCategoryToDelete')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
