import { InvoiceDTO } from "./dto/invoice.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { Client } from "../client/entities/client.entity";
import { Invoice } from "./entities/invoice.entity";
import { User } from "../users/entities/user.entity";
import { WorkItem } from "./entities/workitem.entity";
import * as fs from "fs";
const PDFDocument = require("pdfkit-table");
import { formatDate } from "src/lib/formatDate";
import * as path from "path";

type FileResults = {
  invoice: string;
  timesheet: string;
};

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(WorkItem)
    private workItemRepository: Repository<WorkItem>,
  ) {}

  async releaseInvoice(id: number, referrenceNumber: string) {
    const invoice = await this.invoiceRepository.findOne({
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
      relations: ["client", "workItems"],
      where: {
        id,
      },
    });

    invoice.status = "received";
    invoice.referrenceNumber = referrenceNumber;

    return this.invoiceRepository.save(invoice);
  }

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
        "referrenceNumber",
      ],
      relations: ["client", "workItems"],
      where: {
        id,
      },
    });
  }

  async findAll() {
    return await this.invoiceRepository.find({
      select: [
        "client",
        "clientId",
        "date",
        "id",
        "invoiceNumber",
        "note",
        "status",
        "updatedAt",
        "workItems",
        "client",
      ],
      relations: ["client", "workItems"],
      order: {
        id: "DESC",
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
        "convert_currency_code",
        "current_currency_code",
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
        entry_date: item.entry_date,
        title: item.title,
        rate: currentClient.hourly_rate,
        description: item.description,
        hours: item.hours,
        tags: JSON.stringify(item.tags),
      };
      return workItem;
    });

    const payload: Invoice = {
      id: 0,
      note: invoice.note,
      clientId: currentClient.id,
      client: currentClient,
      invoiceNumber: `${currentClient.code}${currentYear}-${formattedId}`,
      date: invoice.date,
      workItems: workItemsParsed,
      status: "pending",
      referrenceNumber: "",
    };

    this.invoiceRepository.create(payload);

    return this.invoiceRepository.save(payload);
  }

  async generatePdfInvoice(invoiceId: number, host: string): Promise<string> {
    const invoice = await this.invoiceRepository.findOne({
      select: [
        "client",
        "clientId",
        "date",
        "id",
        "invoiceNumber",
        "note",
        "status",
        "updatedAt",
        "workItems",
        "client",
        "referrenceNumber",
      ],
      relations: ["client"],
      where: {
        id: invoiceId,
      },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    const currentClient = await this.clientRepository.findOne({
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
        "created_at",
        "updated_at",
        "symbol",
        "userId",
        "user",
        "convert_currency_code",
        "current_currency_code",
      ],
      where: {
        id: invoice.clientId,
      },
    });

    if (!currentClient) {
      throw new BadRequestException(`Specified client not available.`);
    }

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
        id: currentClient.userId,
      },
    });

    if (!user) {
      throw new BadRequestException(`Specified user not available.`);
    }

    const workItems = await this.workItemRepository.find({
      where: {
        invoiceId: invoice.id,
      },
    });

    const doc = new PDFDocument();
    const filename = `${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(filename);

    const excelFile = `${invoice.invoiceNumber}.csv`;
    const excelFilePath = path.join(excelFile);

    const stream = fs.createWriteStream(filePath);

    const bannerColor = currentClient.banner_color;
    const headlineColor = currentClient.headline_color;
    const textColor = currentClient.text_color;

    doc.pipe(stream);
    doc
      .rect(0, 0, doc.page.width, 120) // Rectangle from the top-left corner spanning the full width of the page
      .fill(bannerColor); // Change to your desired header color

    doc.moveDown(2);

    doc
      .fontSize(55)
      .font("Helvetica-Bold")
      .fillColor(headlineColor)
      .text(`INVOICE`, 20, 20, { align: "left" }); // Position within the header

    doc
      .fontSize(12)
      .fillColor(headlineColor)
      .font("Helvetica-Bold")
      .text(`Invoice #: ${invoice.invoiceNumber}`);

    doc
      .fontSize(12)
      .fillColor(headlineColor)
      .font("Helvetica-Bold")
      .text(`Date: ${formatDate(invoice.date)}`);

    doc.moveDown(3);

    // Billed to section
    doc
      .fontSize(18)
      .fillColor(textColor)
      .font("Helvetica-Bold")
      .text(`Billed to:`);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .font("Helvetica")
      .text(currentClient.name);

    doc.fontSize(10).font("Helvetica").text(currentClient.address);
    doc.fontSize(10).text(`Note: ${invoice.note}`);

    doc.moveDown();

    // Developer section
    doc.fontSize(18).font("Helvetica-Bold").text(`From:`);

    doc.fontSize(14).font("Helvetica-Bold").font("Helvetica").text(user.name);
    doc.fontSize(10).font("Helvetica").text(user.address);
    doc.fontSize(10).font("Helvetica").text(user.email);

    doc.moveDown(3);

    const bankDetails = [
      [
        user.bank_name,
        user.bank_swift_code,
        user.bank_account_name,
        user.bank_account_number,
      ],
    ];

    const bankTable = {
      title: "Bank Information",
      subtitle: "Payment method : Fund Transfer",
      headers: ["Bank", "Swift Code", "Account Name", "Account #"],
      rows: bankDetails,
    };

    await doc.table(bankTable, {
      width: 350,
    });

    doc.moveDown(3);

    const totalAmount = workItems.reduce((sum, item) => {
      return sum + item.hours * currentClient.hourly_rate;
    }, 0);

    const totalHours = workItems.reduce((sum, item) => {
      return sum + item.hours;
    }, 0);

    const rows = workItems.map((item) => {
      return [
        item.title,
        item.description,
        item.hours,
        `${currentClient.symbol} ${currentClient.hourly_rate}`,
        `${currentClient.symbol} ${item.hours * currentClient.hourly_rate}`,
      ];
    });

    rows.push(["", "", "", "Total:", `${currentClient.symbol}${totalAmount}`]);

    // Define CSV headers
    const headers = [
      "Date",
      "Title",
      "Description",
      "Hours",
      `Hourly Rate (${currentClient.symbol})`,
      `Total (${currentClient.symbol})`,
    ];

    const timesheetRows = workItems.map((item) => {
      return [
        item.entry_date.toDateString(),
        item.title,
        `"${item.description}"`,
        item.hours,
        currentClient.hourly_rate,
        item.hours * currentClient.hourly_rate,
      ];
    });

    // Convert rows array to CSV format
    const csvContent = [
      headers.join(","), // Join headers with commas
      ...timesheetRows.map((row) => row.join(",")), // Map each row array to a comma-separated string
    ].join("\n"); // Join each line with newline characters

    const table = {
      title: "Overview",
      subtitle: `Total Hours: ${totalHours}, Total Amount ${currentClient.symbol} ${totalAmount}`,
      headers: ["Item", "Description", "Hours", "Rate", "Amount"],
      rows: rows,
    };

    await doc.table(table, {
      width: 550,
    });

    doc.moveDown(3);

    doc
      .rect(0, doc.page.height - 120, doc.page.width, 120) // Rectangle from the bottom-left corner spanning the full width of the page
      .fill(bannerColor); // Change to your desired footer color

    doc.moveDown();

    doc.end();

    invoice.status = "released";

    this.invoiceRepository.save(invoice);

    // Write CSV content to a file
    fs.writeFileSync(excelFilePath, csvContent);

    const invoicePath = `${host}/files/${filename}`;

    const csv = `${host}/files/${excelFile}`;

    const results: FileResults = {
      invoice: invoicePath,
      timesheet: csv,
    };

    return new Promise((resolve, reject) => {
      stream.on("finish", () => resolve(JSON.stringify(results)));
      stream.on("error", (err) => reject(err));
    });
  }
}
