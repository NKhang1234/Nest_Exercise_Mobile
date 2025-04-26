import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
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
  password: string;
}
