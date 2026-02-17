import { ApiProperty } from "@nestjs/swagger";
import { ClientCategory } from "../entities/client.entity";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from "class-validator";

export class ClientDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  current_currency_code: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  convert_currency_code: string;

  @ApiProperty({ required: true })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100000000)
  hourly_rate: number;

  @ApiProperty({ required: true })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(24)
  hours_per_day: number;

  @ApiProperty({ required: true })
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Max(7)
  days_per_week: number;

  @ApiProperty({ required: true })
  @IsEnum(ClientCategory)
  category: ClientCategory;

  @ApiProperty({ required: false })
  @IsString()
  banner_color: string;

  @ApiProperty({ required: false })
  @IsString()
  headline_color: string;

  @ApiProperty({ required: false })
  @IsString()
  text_color: string;
}
