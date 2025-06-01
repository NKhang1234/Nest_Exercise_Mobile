import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
  @ApiProperty({ description: 'Budget name', example: 'Monthly Food Budget' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Budget amount', example: 300.0 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ description: 'Wallet ID', example: 'uuid-string' })
  @IsNotEmpty()
  @IsString()
  walletId: string;

  @ApiProperty({
    description: 'Repeat pattern',
    example: 'monthly',
    required: false,
  })
  @IsOptional()
  @IsString()
  repeat?: string;
}
