import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ default: '', required: false })
  email: string;
  @ApiProperty({ default: '', required: false })
  password: string;
}
