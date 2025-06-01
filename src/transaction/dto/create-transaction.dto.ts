import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Transaction type', example: 'expense' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'Transaction amount', example: 25.5 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Transaction date',
    example: '2025-04-01T12:30:00Z',
  })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ description: 'Wallet ID', example: 'uuid-string' })
  @IsNotEmpty()
  @IsString()
  walletId: string;

  @ApiProperty({ description: 'Category ID', example: 'uuid-string' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({
    description: 'Repeat pattern',
    example: 'None',
    required: false,
  })
  @IsOptional()
  @IsString()
  repeat?: string;

  @ApiProperty({
    description: 'Transaction note',
    example: 'Lunch at cafe',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Picture URL',
    example: '/images/receipt.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  picture?: string;
}
