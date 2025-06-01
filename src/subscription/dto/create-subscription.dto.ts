import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Subscription name', example: 'Netflix' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Amount for subscription', example: 15.99 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Currency for subscription', example: 'USD' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ description: 'Billing date', example: '2025-05-01T00:00:00Z' })
  @IsNotEmpty()
  @IsString()
  billingDate: string;

  @ApiProperty({ description: 'Repeat pattern', example: 'monthly' })
  @IsNotEmpty()
  @IsString()
  repeat: string;

  @ApiProperty({ description: 'Reminder before (minutes)', example: 1440 })
  @IsOptional()
  @IsNumber()
  reminderBefore: number;

  @ApiProperty({ description: 'Category ID', example: 'uuid-string' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
