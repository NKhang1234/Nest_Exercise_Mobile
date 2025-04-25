import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [CategoryModule, WalletModule],
  controllers: [],
  providers: [],
})
export class AppModule {}