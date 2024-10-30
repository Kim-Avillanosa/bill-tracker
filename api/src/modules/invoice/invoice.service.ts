import { InvoiceDTO } from "./dto/invoice.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { Client } from "../client/entities/client.entity";
import { Invoice } from "./entities/invoice.entity";
import { User } from "../users/entities/user.entity";
import { WorkItem } from "./entities/workitem.entity";

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  findOne(id: number): Promise<Invoice> {
    return this.invoiceRepository.findOne({
      select: [
        "id",
        "clientId",
        "date",
        "invoiceNumber",
        "note",
        "status",
        "workItems",
        "updatedAt",
        "client",
      ],
      where: {
        id,
      },
    });
  }

  async generateInvoice(userId: number, invoice: InvoiceDTO): Promise<Invoice> {
    const currentYear: number = new Date().getFullYear();

    const user = await this.userRepository.findOne({
      select: [
        "id",
        "email",
        "address",
        "name",
        "bank_account_number",
        "bank_name",
        "bank_swift_code",
        "bank_account_name",
        "created_at",
        "clients",
        "updated_at",
      ],
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException(`Specified user not available.`);
    }

    const currentClient = await this.clientRepository.findOne({
      select: [
        "id",
        "email",
        "address",
        "name",
        "code",
        "hourly_rate",
        "hours_per_day",
        "created_at",
        "updated_at",
        "userId",
        "user",
      ],
      where: {
        id: invoice.clientId,
      },
    });

    if (!currentClient) {
      throw new BadRequestException(`Specified client not available.`);
    }

    const invoiceCount = await this.invoiceRepository.maximum("id");

    const formattedId: string = String(invoiceCount + 1).padStart(7, "0");

    const workItemsParsed = invoice.workItems.map((item) => {
      const workItem: WorkItem = {
        title : item.title,
        rate: currentClient.hourly_rate,
        description: item.description,
        hours: item.hours,
        tags : JSON.stringify(item.tags)
      };
      return workItem;
    });

    const payload: Invoice = {
      id: 0,
      note: invoice.note,
      clientId : currentClient.id,
      client : currentClient,
      invoiceNumber: `${currentClient.code}${currentYear}-${formattedId}`,
      date: invoice.date,
      workItems: workItemsParsed,
      status: "pending",
    };

    this.invoiceRepository.create(payload);

    return this.invoiceRepository.save(payload);
  }
}
