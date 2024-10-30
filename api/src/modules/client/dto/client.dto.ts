import { ApiProperty } from '@nestjs/swagger';
import { ClientCategory } from '../entities/client.entity';

export class ClientDto {
  @ApiProperty({ required: false })
  name: string;
  @ApiProperty({ required: false })
  address: string;

  @ApiProperty({ required: false })
  hourly_rate: number;

  @ApiProperty({ required: false })
  hours_per_day: number;


  @ApiProperty({ required: false })
  category: ClientCategory;
}
