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

  async createTimeSheet(
    clientId: number,
    userId: number,
    timeSheetDto: TimeSheetDto,
  ) {
    const client = await this.clientRepository.findOneBy({
      id: clientId,
      userId,
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    const data: TimeSheet = {
      tags: JSON.stringify(timeSheetDto.tags),
      clientId: clientId,
      summary: timeSheetDto.summary,
      entry_date: new Date(timeSheetDto.entry_date),
      client: client,
    };

    this.timeSheetRepository.create(data);

    return this.timeSheetRepository.save(data);
  }
  async findAll(
    id: number,
    userId: number,
    startDate: Date,
    endDate: Date,
    options?: { limit?: number; offset?: number },
  ): Promise<TimeSheet[]> {
    const client = await this.clientRepository.findOneBy({ id, userId });
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    const take = Math.min(Math.max(Number(options?.limit) || 200, 1), 500);
    const skip = Math.max(Number(options?.offset) || 0, 0);

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
      order: {
        entry_date: "DESC",
      },
      take,
      skip,
    });
  }

  async updateTimesheet(
    id: number,
    userId: number,
    timesheetDto: TimeSheetDto,
  ): Promise<TimeSheet> {
    const timeSheet = await this.timeSheetRepository.findOneBy({ id });
    if (!timeSheet) {
      throw new NotFoundException(`Timesheet with id ${id} not found`);
    }
    const client = await this.clientRepository.findOneBy({
      id: timeSheet.clientId,
      userId,
    });
    if (!client) {
      throw new NotFoundException(`Timesheet with id ${id} not found`);
    }

    // Create an object to update
    const updatedData: Partial<TimeSheet> = {
      ...timesheetDto,
      entry_date: new Date(timesheetDto.entry_date),
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

  async deleteTimesheet(id: number, userId: number): Promise<void> {
    const timesheet = await this.timeSheetRepository.findOneBy({ id });
    if (!timesheet) {
      throw new NotFoundException(`Timesheet with id ${id} not found`);
    }

    const client = await this.clientRepository.findOneBy({
      id: timesheet.clientId,
      userId,
    });

    if (!client) {
      throw new NotFoundException(`Timesheet with id ${id} not found`);
    }

    const result = await this.timeSheetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Timesheet with id ${id} not found`);
    }
  }
}
