import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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

    const data = {
      ...timeSheetDto,
      client: client,
    };

    this.timeSheetRepository.create(data);

    return this.timeSheetRepository.save(data);
  }

  findOne(id: number): Promise<TimeSheet[]> {
    return this.timeSheetRepository.find({
      select: ["id", "summary", "entry_date", "created_at", "updated_at"],
      where: {
        clientId: id,
      },
    });
  }

  async updateTimesheet(id: number, timesheetDto: TimeSheetDto): Promise<TimeSheet> {
    const timeSheet = await this.timeSheetRepository.findOneBy({ id });
    if (!timeSheet) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    Object.assign(timeSheet, timesheetDto);
    return this.timeSheetRepository.save(timeSheet);
  }

  async deleteTimesheet(id: number): Promise<void> {
    const result = await this.timeSheetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
  }
}
