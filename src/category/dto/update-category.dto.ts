import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The new unique name of the category',
    example: 'Dining',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
