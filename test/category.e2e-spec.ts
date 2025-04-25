import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { setupTestApp } from './test-utils';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    try {
      const setup = await setupTestApp();
      app = setup.app;
      prismaService = setup.prismaService;

      // Clean up before starting to ensure a fresh state
      await prismaService.cleanDatabase();
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
      // Clean up database
      await prismaService.cleanDatabase();
      await app.close();
    } catch (error) {
      console.error('Error in afterAll cleanup:', error);
    }
  });

  it('/categories (POST) - creates a new category', async () => {
    try {
      const response = await request(app.getHttpServer())
        .post('/categories')
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
        .send({ name: 'TestCategory2' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/categories')
        .send({ name: 'TestCategory3' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/categories')
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
        .send({ name: 'TestCategory4' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/categories/TestCategory4')
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
        .send({ name: 'TestCategory5' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .put('/categories/TestCategory5')
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
        .send({ name: 'TestCategoryToDelete' })
        .expect(201);

      // Delete category
      await request(app.getHttpServer())
        .delete('/categories/TestCategoryToDelete')
        .expect(204);

      // Verify deletion
      await request(app.getHttpServer())
        .get('/categories/TestCategoryToDelete')
        .expect(404);
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
