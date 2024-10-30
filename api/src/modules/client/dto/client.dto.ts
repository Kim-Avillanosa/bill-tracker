import { ApiProperty } from '@nestjs/swagger';
import { ClientCategory } from '../entities/client.entity';

export class ClientDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  code: string;

  @ApiProperty({ required: true })
  address: string;

  @ApiProperty({ required: true })
  hourly_rate: number;

  @ApiProperty({ required: true })
  hours_per_day: number;

  @ApiProperty({ required: true })
  category: ClientCategory;
}
