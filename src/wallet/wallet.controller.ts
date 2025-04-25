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
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wallets' })
  @ApiResponse({ status: 200, description: 'List of wallets' })
  async findAll() {
    return this.walletService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a wallet by name' })
  @ApiResponse({ status: 200, description: 'Wallet found' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async findOne(@Param('name') name: string) {
    return this.walletService.findOne(name);
  }

  @Put(':name')
  @ApiOperation({ summary: 'Update a wallet by name' })
  @ApiResponse({ status: 200, description: 'Wallet updated successfully' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async update(
    @Param('name') name: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.update(name, updateWalletDto);
  }

  @Delete(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a wallet by name' })
  @ApiResponse({ status: 204, description: 'Wallet deleted successfully' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async remove(@Param('name') name: string) {
    return this.walletService.remove(name);
  }
}
