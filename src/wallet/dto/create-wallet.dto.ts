import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({
    description: 'The unique name of the wallet',
    example: 'Cash',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The initial amount in the wallet',
    example: 500.0,
  })
  @IsNumber()
  @IsNotEmpty()
  initAmount: number;

  @ApiProperty({ description: 'The currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Optional category name for visibility',
    example: 'Food',
    required: false,
  })
  @IsString()
  @IsOptional()
  visibleCategory?: string;
}
