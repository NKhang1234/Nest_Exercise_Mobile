import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        // Exclude password for security
      },
    });

    if (!userProfile) {
      throw new NotFoundException(`User profile with ID ${id} not found`);
    }

    return userProfile;
  }

  async update(id: string, updateUserProfileDto: UpdateUserProfileDto) {
    const existingUser = await this.prisma.userProfile.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User profile with ID ${id} not found`);
    }

    // Update only allowed fields (not password)
    return this.prisma.userProfile.update({
      where: { id },
      data: {
        name: updateUserProfileDto.name,
        avatar: updateUserProfileDto.avatar,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        // Exclude password for security
      },
    });
  }

  async getStatistics(userId: string) {
    // Get count of categories, wallets, transactions and total expenses/income
    const categoryCount = await this.prisma.category.count({
      where: { userId },
    });

    const walletCount = await this.prisma.wallet.count({
      where: { userId },
    });

    const transactionCount = await this.prisma.transaction.count({
      where: { userId },
    });

    const expenses = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'expense',
      },
      _sum: {
        amount: true,
      },
    });

    const incomes = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'income',
      },
      _sum: {
        amount: true,
      },
    });

    return {
      categories: categoryCount,
      wallets: walletCount,
      transactions: transactionCount,
      totalExpenses: expenses._sum.amount || 0,
      totalIncome: incomes._sum.amount || 0,
      balance: (incomes._sum.amount || 0) - (expenses._sum.amount || 0),
    };
  }
}
