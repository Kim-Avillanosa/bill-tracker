import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { WorkItemDTO } from './workitem.dto'; // Adjust the import path as needed

export class InvoiceDTO {
  @ApiProperty({  required: true })
  clientId : number

  @ApiProperty({ required: true, type: String, format: 'date-time' })
  date: Date; // Use string with a date format and validate if necessary


  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  note: string;

  @ApiProperty({ type: [WorkItemDTO], required: true })
  @ValidateNested({ each: true })
  @Type(() => WorkItemDTO)
  workItems: WorkItemDTO[];

}

export class UpdateInvoiceDTO extends PartialType(InvoiceDTO) {}
