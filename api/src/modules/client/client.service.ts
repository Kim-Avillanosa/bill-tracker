import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { Client } from "./entities/client.entity";
import { ClientDto } from "./dto/client.dto";
import { TimeSheet } from "../timesheet/entities/timesheet.entity";
import { Invoice } from "../invoice/entities/invoice.entity";
import { WorkItem } from "../invoice/entities/workitem.entity";
import { AuditLog } from "../audit/entities/audit-log.entity";

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
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
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

    const saved = await this.clientRepository.save(data);
    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        userId,
        action: "CLIENT_CREATED",
        resourceType: "client",
        resourceId: saved.id,
      }),
    );
    return saved;
  }

  findAll(
    id: number,
    options?: { limit?: number; offset?: number; search?: string },
  ): Promise<Client[]> {
    const take = Math.min(Math.max(Number(options?.limit) || 100, 1), 200);
    const skip = Math.max(Number(options?.offset) || 0, 0);

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
        ...(options?.search
          ? {
              name: Like(`%${options.search}%`),
            }
          : {}),
      },
      take,
      skip,
    });
  }

  findOne(id: number, userId: number): Promise<Client> {
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
        userId,
      },
    });
  }

  async updateClient(id: number, userId: number, clientDto: ClientDto): Promise<Client> {
    const client = await this.clientRepository.findOneBy({ id, userId });
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    Object.assign(client, clientDto);
    const saved = await this.clientRepository.save(client);
    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        userId,
        action: "CLIENT_UPDATED",
        resourceType: "client",
        resourceId: saved.id,
      }),
    );
    return saved;
  }

  async deleteClient(id: number, userId: number): Promise<void> {
    await this.clientRepository.manager.transaction(async (manager) => {
      const clientRepo = manager.getRepository(Client);
      const invoiceRepo = manager.getRepository(Invoice);
      const workItemRepo = manager.getRepository(WorkItem);
      const timesheetRepo = manager.getRepository(TimeSheet);

      const client = await clientRepo.findOne({ where: { id, userId } });
      if (!client) {
        throw new NotFoundException(`Client with id ${id} not found`);
      }

      const invoices = await invoiceRepo.find({
        where: { clientId: id },
        select: ["id"],
      });

      for (const invoice of invoices) {
        await workItemRepo.delete({ invoiceId: invoice.id });
      }

      await invoiceRepo.delete({ clientId: id });
      await timesheetRepo.delete({ clientId: id });
      await clientRepo.remove(client);
      await manager.getRepository(AuditLog).save({
        userId,
        action: "CLIENT_DELETED",
        resourceType: "client",
        resourceId: id,
      });
    });
  }
}
