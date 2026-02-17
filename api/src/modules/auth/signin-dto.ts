import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ default: '', required: false })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsNotEmpty()
  password: string;
}
