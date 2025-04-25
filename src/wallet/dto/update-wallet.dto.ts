import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWalletDto {
  @ApiProperty({
    description: 'The new unique name of the wallet',
    example: 'Cash Updated',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The new initial amount in the wallet',
    example: 600.0,
  })
  @IsNumber()
  @IsNotEmpty()
  initAmount: number;

  @ApiProperty({ description: 'The new currency code', example: 'USD' })
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
