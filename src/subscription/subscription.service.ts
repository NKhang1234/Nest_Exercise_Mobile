import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, userId: string) {
    return this.prisma.subscription.create({
      data: {
        name: createSubscriptionDto.name,
        amount: createSubscriptionDto.amount,
        currency: createSubscriptionDto.currency,
        billingDate: createSubscriptionDto.billingDate,
        repeat: createSubscriptionDto.repeat,
        reminderBefore: createSubscriptionDto.reminderBefore,
        categoryId: createSubscriptionDto.categoryId,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: { category: true },
    });
  }

  async findOne(id: string, userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }
    return subscription;
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
    userId: string,
  ) {
    await this.findOne(id, userId); // Ensure subscription exists and belongs to user
    return this.prisma.subscription.update({
      where: { id },
      data: {
        name: updateSubscriptionDto.name,
        amount: updateSubscriptionDto.amount,
        currency: updateSubscriptionDto.currency,
        billingDate: updateSubscriptionDto.billingDate,
        repeat: updateSubscriptionDto.repeat,
        reminderBefore: updateSubscriptionDto.reminderBefore,
        categoryId: updateSubscriptionDto.categoryId,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Ensure subscription exists and belongs to user
    return this.prisma.subscription.delete({
      where: { id },
    });
  }
}
