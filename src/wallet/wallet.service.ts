/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

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
