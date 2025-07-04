import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWalletDto: CreateWalletDto, userId: string) {
    // get the id of the category
    const category = await this.prisma.category.findFirst({
      where: { name: createWalletDto.visibleCategory, userId },
      select: {
        id: true,
      },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with name ${createWalletDto.visibleCategory} not found`,
      );
    }
    return this.prisma.wallet.create({
      data: {
        name: createWalletDto.name,
        initAmount: createWalletDto.initAmount,
        currency: createWalletDto.currency,
        visibleCategory: category.id,
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

  async findOne(name: string, userId: string) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { name, userId },
      include: { category: true },
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet with name ${name} not found`);
    }
    return wallet;
  }

  async update(name: string, updateWalletDto: UpdateWalletDto, userId: string) {
    await this.findOne(name, userId); // Ensure wallet exists and belongs to user
    // get the wallet id
    const wallet = await this.prisma.wallet.findFirst({
      where: { name, userId },
      select: {
        id: true,
      },
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet with name ${name} not found`);
    }
    // get the id of the category
    const category = await this.prisma.category.findFirst({
      where: { name: updateWalletDto.visibleCategory, userId },
      select: {
        id: true,
      },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with name ${updateWalletDto.visibleCategory} not found`,
      );
    }
    return this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        name: updateWalletDto.name,
        initAmount: updateWalletDto.initAmount,
        currency: updateWalletDto.currency,
        visibleCategory: category.id,
      },
    });
  }

  async remove(name: string, userId: string) {
    await this.findOne(name, userId); // Ensure wallet exists and belongs to user
    // get the wallet id
    const wallet = await this.prisma.wallet.findFirst({
      where: { name, userId },
      select: {
        id: true,
      },
    });
    return this.prisma.wallet.delete({
      where: { id: wallet!.id },
    });
  }
}
