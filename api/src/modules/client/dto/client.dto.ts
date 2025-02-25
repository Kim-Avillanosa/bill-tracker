import { ApiProperty } from "@nestjs/swagger";
import { ClientCategory } from "../entities/client.entity";

export class ClientDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  code: string;

  @ApiProperty({ required: true })
  symbol: string;

  @ApiProperty({ required: true })
  address: string;

  @ApiProperty({ required: true })
  current_currency_code: string;

  @ApiProperty({ required: true })
  convert_currency_code: string;

  @ApiProperty({ required: true })
  hourly_rate: number;

  @ApiProperty({ required: true })
  hours_per_day: number;

  @ApiProperty({ required: true })
  days_per_week: number;

  @ApiProperty({ required: true })
  category: ClientCategory;

  @ApiProperty({ required: false })
  banner_color: string;

  @ApiProperty({ required: false })
  headline_color: string;

  @ApiProperty({ required: false })
  text_color: string;
}
