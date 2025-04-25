import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { WalletModule } from './wallet/wallet.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CategoryModule, WalletModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
