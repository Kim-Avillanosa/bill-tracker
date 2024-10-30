import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ default: '', required: false })
  email: string;
  @ApiProperty({ default: '', required: false })
  password: string;
}
