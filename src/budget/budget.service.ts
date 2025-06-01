import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBudgetDto: CreateBudgetDto, userId: string) {
    return this.prisma.budget.create({
      data: {
        name: createBudgetDto.name,
        amount: createBudgetDto.amount,
        currency: createBudgetDto.currency,
        walletId: createBudgetDto.walletId,
        repeat: createBudgetDto.repeat || 'None',
        userId,
      },
      include: { wallet: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.budget.findMany({
      where: { userId },
      include: { wallet: true },
    });
  }

  async findOne(id: string, userId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
      include: { wallet: true },
    });

    if (!budget) {
      throw new NotFoundException(`Budget with id ${id} not found`);
    }

    return budget;
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto, userId: string) {
    await this.findOne(id, userId); // Ensure budget exists and belongs to user

    return this.prisma.budget.update({
      where: { id },
      data: {
        name: updateBudgetDto.name,
        amount: updateBudgetDto.amount,
        currency: updateBudgetDto.currency,
        walletId: updateBudgetDto.walletId,
        repeat: updateBudgetDto.repeat,
      },
      include: { wallet: true },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Ensure budget exists and belongs to user

    return this.prisma.budget.delete({
      where: { id },
    });
  }
}
