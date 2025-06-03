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
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('wallets')
@ApiBearerAuth('JWT-auth')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @Body() createWalletDto: CreateWalletDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.walletService.create(createWalletDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wallets' })
  @ApiResponse({ status: 200, description: 'List of wallets' })
  async findAll(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.walletService.findAll(userId);
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a wallet by name' })
  @ApiResponse({ status: 200, description: 'Wallet found' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async findOne(@Param('name') name: string, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.walletService.findOne(name, userId);
  }

  @Put(':name')
  @ApiOperation({ summary: 'Update a wallet by name' })
  @ApiResponse({ status: 200, description: 'Wallet updated successfully' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async update(
    @Param('name') name: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.walletService.update(name, updateWalletDto, userId);
  }

  @Delete(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a wallet by name' })
  @ApiResponse({ status: 204, description: 'Wallet deleted successfully' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async remove(@Param('name') name: string, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.walletService.remove(name, userId);
  }
}
