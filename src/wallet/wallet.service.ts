import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletService {
  private readonly prisma = new PrismaClient();

  async create(createWalletDto: CreateWalletDto) {
    return this.prisma.wallet.create({
      data: {
        name: createWalletDto.name,
        initAmount: createWalletDto.initAmount,
        currency: createWalletDto.currency,
        visibleCategory: createWalletDto.visibleCategory,
      },
    });
  }

  async findAll() {
    return this.prisma.wallet.findMany({
      include: { category: true }, // Include related Category
    });
  }

  async findOne(name: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { name },
      include: { category: true },
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet with name ${name} not found`);
    }
    return wallet;
  }

  async update(name: string, updateWalletDto: UpdateWalletDto) {
    await this.findOne(name); // Ensure wallet exists
    return this.prisma.wallet.update({
      where: { name },
      data: {
        name: updateWalletDto.name,
        initAmount: updateWalletDto.initAmount,
        currency: updateWalletDto.currency,
        visibleCategory: updateWalletDto.visibleCategory,
      },
    });
  }

  async remove(name: string) {
    await this.findOne(name); // Ensure wallet exists
    return this.prisma.wallet.delete({
      where: { name },
    });
  }
}