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

  async findOne(name: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { name, userId },
      select: {
        name: true,
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with name ${name} not found`);
    }
    return category;
  }

  async update(
    name: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ) {
    await this.findOne(name, userId); // Ensure category exists and belongs to user
    // get the category id
    const category = await this.prisma.category.findFirst({
      where: { name, userId },
      select: {
        id: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with name ${name} not found`);
    }

    return this.prisma.category.update({
      where: { id: category.id },
      data: {
        name: updateCategoryDto.name,
      },
      select: {
        name: true,
      },
    });
  }

  async remove(name: string, userId: string) {
    await this.findOne(name, userId); // Ensure wallet exists and belongs to user
    // get the category id
    const category = await this.prisma.category.findFirst({
      where: { name, userId },
      select: {
        id: true,
      },
    });
    return this.prisma.category.delete({
      where: { id: category!.id },
    });
  }
}
