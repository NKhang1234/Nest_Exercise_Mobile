import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    // Delete data in reverse order of dependencies to avoid foreign key conflicts
    const tablenames = [
      'Transaction',
      'Budget',
      'Subscription',
      'Wallet',
      'Category',
      'UserProfile',
    ];

    for (const table of tablenames) {
      await this.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    }
  }

  // New method that preserves user profiles during cleanup
  async cleanDatabasePreserveUsers() {
    // Delete data in reverse order of dependencies but exclude UserProfile
    const tablenames = [
      'Transaction',
      'Budget',
      'Subscription',
      'Wallet',
      'Category',
    ];

    for (const table of tablenames) {
      await this.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    }
  }
}
