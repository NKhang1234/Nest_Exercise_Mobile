import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { WalletModule } from './wallet/wallet.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TransactionModule } from './transaction/transaction.module';
import { BudgetModule } from './budget/budget.module';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [
    AuthModule,
    CategoryModule,
    WalletModule,
    PrismaModule,
    SubscriptionModule,
    TransactionModule,
    BudgetModule,
    UserProfileModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
