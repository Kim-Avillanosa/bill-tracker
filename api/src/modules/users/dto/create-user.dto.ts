import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ default: "", required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: "", required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ default: "", required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: "", required: true })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ default: "", required: true })
  @IsString()
  @IsNotEmpty()
  bank_name: string;

  @ApiProperty({ default: "", required: true })
  @IsString()
  @IsNotEmpty()
  bank_swift_code: string;

  @ApiProperty({ default: "", required: true })
  @IsString()
  @IsNotEmpty()
  bank_account_number: string;

  @ApiProperty({ default: "", required: true })
  @IsString()
  @IsNotEmpty()
  bank_account_name: string;
}
