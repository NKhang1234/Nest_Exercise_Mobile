/* eslint-disable @typescript-eslint/require-await */

import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
      select: {
        id: true,
        name: true,
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ) {
    await this.findOne(id, userId); // Ensure category exists and belongs to user
    return this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Ensure wallet exists and belongs to user
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
