import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { Client } from "./entities/client.entity";
import { ClientDto } from "./dto/client.dto";
import { TimeSheet } from "../timesheet/entities/timesheet.entity";
import { Invoice } from "../invoice/entities/invoice.entity";
import { WorkItem } from "../invoice/entities/workitem.entity";

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(TimeSheet)
    private timesheetRepository: Repository<TimeSheet>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(WorkItem)
    private workItemRepository: Repository<WorkItem>,
  ) {}

  async createClient(userId: number, clientDto: ClientDto) {
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });

    const data = {
      ...clientDto,
      user: user,
    };

    this.clientRepository.create(data);

    return this.clientRepository.save(data);
  }

  findAll(id: number): Promise<Client[]> {
    return this.clientRepository.find({
      select: [
        "id",
        "email",
        "address",
        "name",
        "code",
        "hourly_rate",
        "headline_color",
        "banner_color",
        "text_color",
        "hours_per_day",
        "days_per_week",
        "created_at",
        "updated_at",
        "symbol",
        "userId",
        "user",
        "category",
        "convert_currency_code",
        "current_currency_code",
      ],
      where: {
        userId: id,
      },
    });
  }

  findOne(id: number): Promise<Client> {
    return this.clientRepository.findOne({
      select: [
        "id",
        "email",
        "address",
        "name",
        "code",
        "hourly_rate",
        "headline_color",
        "banner_color",
        "text_color",
        "hours_per_day",
        "days_per_week",
        "created_at",
        "updated_at",
        "symbol",
        "userId",
        "user",
        "category",
        "convert_currency_code",
        "current_currency_code",
      ],
      where: {
        id: id,
      },
    });
  }

  async updateClient(id: number, clientDto: ClientDto): Promise<Client> {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    Object.assign(client, clientDto);
    return this.clientRepository.save(client);
  }

  async deleteClient(id: number): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    const invoices = await this.invoiceRepository.find({
      where: { clientId: id },
      select: ["id"],
    });
    for (const invoice of invoices) {
      await this.workItemRepository.delete({ invoiceId: invoice.id });
    }
    await this.invoiceRepository.delete({ clientId: id });
    await this.timesheetRepository.delete({ clientId: id });
    await this.clientRepository.remove(client);
  }
}
