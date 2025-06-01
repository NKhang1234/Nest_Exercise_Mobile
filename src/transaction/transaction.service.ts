import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    return this.prisma.transaction.create({
      data: {
        type: createTransactionDto.type,
        amount: createTransactionDto.amount,
        currency: createTransactionDto.currency,
        date: createTransactionDto.date,
        walletId: createTransactionDto.walletId,
        categoryId: createTransactionDto.categoryId,
        repeat: createTransactionDto.repeat || 'None',
        note: createTransactionDto.note,
        picture: createTransactionDto.picture,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: { wallet: true, category: true },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { wallet: true, category: true },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ) {
    await this.findOne(id, userId); // Ensure transaction exists and belongs to user

    return this.prisma.transaction.update({
      where: { id },
      data: {
        type: updateTransactionDto.type,
        amount: updateTransactionDto.amount,
        currency: updateTransactionDto.currency,
        date: updateTransactionDto.date,
        walletId: updateTransactionDto.walletId,
        categoryId: updateTransactionDto.categoryId,
        repeat: updateTransactionDto.repeat,
        note: updateTransactionDto.note,
        picture: updateTransactionDto.picture,
      },
      include: { wallet: true, category: true },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Ensure transaction exists and belongs to user

    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
