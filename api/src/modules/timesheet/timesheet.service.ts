import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { TimeSheet } from "./entities/timesheet.entity";
import { TimeSheetDto } from "./dto/timesheet.dto";
import { Client } from "../client/entities/client.entity";

@Injectable()
export class TimeSheetService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(TimeSheet)
    private timeSheetRepository: Repository<TimeSheet>,
  ) {}

  async createTimeSheet(clientId: number, timeSheetDto: TimeSheetDto) {
    const client = await this.clientRepository.findOneBy({
      id: clientId,
    });

    const data: TimeSheet = {
      tags: JSON.stringify(timeSheetDto.tags),
      clientId: clientId,
      summary: timeSheetDto.summary,
      entry_date: timeSheetDto.entry_date,
      client: client,
    };

    this.timeSheetRepository.create(data);

    return this.timeSheetRepository.save(data);
  }
  findAll(id: number, startDate: Date, endDate: Date): Promise<TimeSheet[]> {
    return this.timeSheetRepository.find({
      select: [
        "id",
        "summary",
        "entry_date",
        "created_at",
        "updated_at",
        "client",
        "tags",
      ],
      relations: ["client"],
      where: {
        clientId: id,
        entry_date: Between(startDate, endDate),
      },
    });
  }

  async updateTimesheet(
    id: number,
    timesheetDto: TimeSheetDto,
  ): Promise<TimeSheet> {
    const timeSheet = await this.timeSheetRepository.findOneBy({ id });
    if (!timeSheet) {
      throw new NotFoundException(`Timesheet with id ${id} not found`);
    }

    // Create an object to update
    const updatedData: Partial<TimeSheet> = {
      ...timesheetDto,
      tags: JSON.stringify(timesheetDto.tags), // Convert tags to JSON if necessary
      updated_at: new Date(), // Update the timestamp
    };

    // Avoid updating the id field directly
    Object.assign(timeSheet, updatedData);

    try {
      return await this.timeSheetRepository.save(timeSheet);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update timesheet: ${error.message}`,
      );
    }
  }

  async deleteTimesheet(id: number): Promise<void> {
    const result = await this.timeSheetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
  }
}
