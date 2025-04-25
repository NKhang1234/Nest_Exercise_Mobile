import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The unique name of the category',
    example: 'Food',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
