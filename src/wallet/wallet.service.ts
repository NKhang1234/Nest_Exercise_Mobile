import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWalletDto: CreateWalletDto, userId: string) {
    return this.prisma.wallet.create({
      data: {
        name: createWalletDto.name,
        initAmount: createWalletDto.initAmount,
        currency: createWalletDto.currency,
        visibleCategory: createWalletDto.visibleCategory,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.wallet.findMany({
      where: { userId },
      include: { category: true },
    });
  }

  async findOne(id: string, userId: string) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet with id ${id} not found`);
    }
    return wallet;
  }

  async update(id: string, updateWalletDto: UpdateWalletDto, userId: string) {
    await this.findOne(id, userId); // Ensure wallet exists and belongs to user
    return this.prisma.wallet.update({
      where: { id },
      data: {
        name: updateWalletDto.name,
        initAmount: updateWalletDto.initAmount,
        currency: updateWalletDto.currency,
        visibleCategory: updateWalletDto.visibleCategory,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Ensure wallet exists and belongs to user
    return this.prisma.wallet.delete({
      where: { id },
    });
  }
}
