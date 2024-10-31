import { ApiProperty } from '@nestjs/swagger';

export class TimeSheetDto {
  @ApiProperty({ required: true })
  summary: string;
  @ApiProperty({ required: true })
  entry_date: Date;

  @ApiProperty({ required: true })
  tags: string[];
}
