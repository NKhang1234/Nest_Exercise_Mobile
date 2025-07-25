import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth('JWT-auth')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    console.log('Token user data:', req.user);
    console.log('Creating category for user:', userId);
    return this.categoryService.create(createCategoryDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  async findAll(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.categoryService.findAll(userId);
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a category by name' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('name') name: string, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.categoryService.findOne(name, userId);
  }

  @Put(':name')
  @ApiOperation({ summary: 'Update a category by name' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async update(
    @Param('name') name: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.categoryService.update(name, updateCategoryDto, userId);
  }

  @Delete(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category by name' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('name') name: string, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    await this.categoryService.remove(name, userId);
    // Không return gì cả để trả về 204 No Content
  }
}
