import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'Username for the account',
    example: 'johndoe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Password for the account',
    example: 'StrongP@ssw0rd!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Optional avatar URL',
    example: '/images/avatar.png',
    required: false,
  })
  @IsString()
  avatar?: string;
}
