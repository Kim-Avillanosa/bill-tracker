import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class TimeSheetDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ required: true })
  @IsDateString()
  entry_date: string;

  @ApiProperty({ required: true, type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  tags: string[];
}
