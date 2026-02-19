import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { WorkItemDTO } from './workitem.dto';

export class InvoiceDTO {
  @ApiProperty({ required: true })
  @IsNumber()
  clientId: number;

  @ApiProperty({ required: true, type: String, format: 'date-time' })
  @IsDateString()
  date: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ type: [WorkItemDTO], required: true })
  @ValidateNested({ each: true })
  @Type(() => WorkItemDTO)
  workItems: WorkItemDTO[];

}

export class UpdateInvoiceDTO extends PartialType(InvoiceDTO) {}
