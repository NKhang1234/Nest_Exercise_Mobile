/* eslint-disable @typescript-eslint/require-await */

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(name: string) {
    const category = await this.prisma.category.findUnique({
      where: { name },
    });
    if (!category) {
      throw new NotFoundException(`Category with name ${name} not found`);
    }
    return category;
  }

  async update(name: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(name); // Ensure category exists
    return this.prisma.category.update({
      where: { name },
      data: {
        name: updateCategoryDto.name,
      },
    });
  }

  async remove(name: string) {
    await this.findOne(name); // Ensure category exists
    return this.prisma.category.delete({
      where: { name },
    });
  }
}
