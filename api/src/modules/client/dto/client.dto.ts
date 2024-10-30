import { ApiProperty } from '@nestjs/swagger';
import { ClientCategory } from '../entities/client.entity';

export class ClientDto {
  @ApiProperty({ required: false })
  name: string;
  @ApiProperty({ required: false })
  address: string;

  @ApiProperty({ required: false })
  category: ClientCategory;
}
