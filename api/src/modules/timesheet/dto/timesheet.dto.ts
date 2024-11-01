import { ApiProperty } from "@nestjs/swagger";
import { isArray, isString } from "class-validator";

export class TimeSheetDto {
  @ApiProperty({ required: true })
  summary: string;
  @ApiProperty({ required: true })
  entry_date: Date;

  @ApiProperty({ required: true, type: [String] })
  tags: string[];
}
