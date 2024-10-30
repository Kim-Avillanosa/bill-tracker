import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ default: "", required: true })
  email: string;
  @ApiProperty({ default: "", required: true })
  password: string;

  @ApiProperty({ default: "", required: true })
  name: string;

  @ApiProperty({ default: "", required: true })
  address: string;

  @ApiProperty({ default: "", required: true })
  bank_name: string;

  @ApiProperty({ default: "", required: true })
  bank_swift_code: string;

  @ApiProperty({ default: "", required: true })
  bank_account_number: string;

  @ApiProperty({ default: "", required: true })
  bank_account_name: string;
}
