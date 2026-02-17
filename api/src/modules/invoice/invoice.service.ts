import { InvoiceDTO, UpdateInvoiceDTO } from "./dto/invoice.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { Client } from "../client/entities/client.entity";
import { Invoice } from "./entities/invoice.entity";
import { User } from "../users/entities/user.entity";
import { WorkItem } from "./entities/workitem.entity";
import { AuditLog } from "../audit/entities/audit-log.entity";
import * as fs from "fs";
const PDFDocument = require("pdfkit-table");
import { formatDate } from "../../lib/formatDate";
import { roundCurrency, toNumber } from "../../lib/currency";
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
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async releaseInvoice(id: number, userId: number, referrenceNumber: string) {
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
        "referrenceNumber",
      ],
      relations: ["client", "workItems"],
      where: {
        id,
        client: {
          userId,
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    invoice.status = "received";
    invoice.referrenceNumber = referrenceNumber;
    const saved = await this.invoiceRepository.save(invoice);
    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        userId,
        action: "INVOICE_RECEIVED",
        resourceType: "invoice",
        resourceId: id,
        metadata: JSON.stringify({ referrenceNumber }),
      }),
    );
    return saved;
  }

  findOne(id: number, userId: number): Promise<Invoice> {
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
        client: {
          userId,
        },
      },
    });
  }

  async updateInvoice(
    id: number,
    userId: number,
    invoiceDTO: UpdateInvoiceDTO,
  ): Promise<Invoice> {
    return this.invoiceRepository.manager.transaction(async (manager) => {
      const invoiceRepo = manager.getRepository(Invoice);
      const workItemRepo = manager.getRepository(WorkItem);
      const clientRepo = manager.getRepository(Client);

      const invoice = await invoiceRepo.findOne({
        relations: ["client", "workItems"],
        where: {
          id,
          client: {
            userId,
          },
        },
      });
      if (!invoice) {
        throw new NotFoundException(`Invoice with id ${id} not found`);
      }

      const currentClient = await clientRepo.findOne({
        where: { id: invoice.clientId },
      });
      if (!currentClient) {
        throw new BadRequestException(`Client not available.`);
      }

      if (invoiceDTO.note !== undefined) invoice.note = invoiceDTO.note;
      if (invoiceDTO.date !== undefined) {
        invoice.date =
          invoiceDTO.date instanceof Date
            ? invoiceDTO.date
            : new Date(invoiceDTO.date as string);
      }

      if (invoiceDTO.workItems?.length !== undefined) {
        await workItemRepo.delete({ invoiceId: id });
        const newWorkItems = invoiceDTO.workItems.map((item) =>
          workItemRepo.create({
            entry_date: item.entry_date,
            title: item.title,
            rate: currentClient.hourly_rate,
            description: item.description,
            hours: item.hours,
            tags: JSON.stringify(item.tags),
            invoiceId: id,
          }),
        );
        await workItemRepo.save(newWorkItems);
      }
      const saved = await invoiceRepo.save(invoice);
      await manager.getRepository(AuditLog).save({
        userId,
        action: "INVOICE_UPDATED",
        resourceType: "invoice",
        resourceId: id,
      });
      return saved;
    });
  }

  async deleteInvoice(id: number, userId: number): Promise<void> {
    await this.invoiceRepository.manager.transaction(async (manager) => {
      const invoiceRepo = manager.getRepository(Invoice);
      const workItemRepo = manager.getRepository(WorkItem);

      const invoice = await invoiceRepo.findOne({
        where: {
          id,
          client: {
            userId,
          },
        },
      });
      if (!invoice) {
        throw new NotFoundException(`Invoice with id ${id} not found`);
      }

      await workItemRepo.delete({ invoiceId: id });
      await invoiceRepo.remove(invoice);
      await manager.getRepository(AuditLog).save({
        userId,
        action: "INVOICE_DELETED",
        resourceType: "invoice",
        resourceId: id,
      });
    });
  }

  async findByUser(
    userId: number,
    options?: {
      limit?: number;
      offset?: number;
      status?: "pending" | "released" | "received";
      clientId?: number;
    },
  ) {
    const take = Math.min(Math.max(toNumber(options?.limit) || 50, 1), 200);
    const skip = Math.max(toNumber(options?.offset) || 0, 0);

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
      where: {
        client: {
          userId: userId,
          ...(options?.clientId ? { id: options.clientId } : {}),
        },
        ...(options?.status ? { status: options.status } : {}),
      },
      order: {
        id: "DESC",
      },
      take,
      skip,
    });
  }

  async generateInvoice(userId: number, invoice: InvoiceDTO): Promise<Invoice> {
    const currentYear: number = new Date().getFullYear();

    return this.invoiceRepository.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const clientRepo = manager.getRepository(Client);
      const invoiceRepo = manager.getRepository(Invoice);

      const user = await userRepo.findOne({
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

      const currentClient = await clientRepo.findOne({
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
          userId,
        },
      });

      if (!currentClient) {
        throw new BadRequestException(`Specified client not available.`);
      }

      await manager.query(
        "INSERT INTO `invoice_sequence` (`clientId`, `year`, `currentValue`) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE `currentValue` = `currentValue` + 1",
        [currentClient.id, currentYear],
      );

      const [sequence] = await manager.query(
        "SELECT `currentValue` FROM `invoice_sequence` WHERE `clientId` = ? AND `year` = ?",
        [currentClient.id, currentYear],
      );

      const formattedId: string = String(sequence.currentValue).padStart(7, "0");

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

      invoiceRepo.create(payload);

      const saved = await invoiceRepo.save(payload);
      await manager.getRepository(AuditLog).save({
        userId,
        action: "INVOICE_CREATED",
        resourceType: "invoice",
        resourceId: saved.id,
      });

      return saved;
    });
  }

  async getChartSummary(userId: number, clientId?: number) {
    // Use raw SQL queries for better performance with database-level aggregation
    const manager = this.invoiceRepository.manager;

    // Base query parameters - always filter by userId
    const baseParams = [userId];
    
    // Build additional WHERE conditions for client filtering
    let clientFilter = '';
    if (clientId) {
      clientFilter = 'AND c.id = ?';
      baseParams.push(clientId);
    }

    // 1. Monthly income aggregation with raw SQL
    const monthlyIncomeQuery = `
      SELECT 
        DATE_FORMAT(i.date, '%Y-%m') as month,
        c.current_currency_code as currency,
        c.symbol,
        i.status,
        SUM(w.hours * w.rate) as amount,
        SUM(w.hours) as hours
      FROM invoice i
      INNER JOIN client c ON i.clientId = c.id
      INNER JOIN work_item w ON w.invoiceId = i.id
      WHERE c.userId = ? ${clientFilter}
      GROUP BY DATE_FORMAT(i.date, '%Y-%m'), c.current_currency_code, c.symbol, i.status
      ORDER BY month ASC
    `;

    // 2. Client income aggregation
    const clientIncomeQuery = `
      SELECT 
        c.name as client,
        c.current_currency_code as currency,
        c.symbol,
        i.status,
        SUM(w.hours * w.rate) as amount,
        SUM(w.hours) as hours
      FROM invoice i
      INNER JOIN client c ON i.clientId = c.id
      INNER JOIN work_item w ON w.invoiceId = i.id
      WHERE c.userId = ? ${clientFilter}
      GROUP BY c.id, c.name, c.current_currency_code, c.symbol, i.status
      ORDER BY c.name
    `;

    // 3. Status summary by currency
    const statusSummaryQuery = `
      SELECT 
        c.current_currency_code as currency,
        c.symbol,
        i.status,
        SUM(w.hours * w.rate) as amount
      FROM invoice i
      INNER JOIN client c ON i.clientId = c.id
      INNER JOIN work_item w ON w.invoiceId = i.id
      WHERE c.userId = ? ${clientFilter}
      GROUP BY c.current_currency_code, c.symbol, i.status
    `;

    // 4. Currency breakdown
    const currencyBreakdownQuery = `
      SELECT 
        c.current_currency_code as currency,
        c.symbol,
        SUM(w.hours * w.rate) as totalAmount,
        COUNT(DISTINCT i.id) as invoiceCount
      FROM invoice i
      INNER JOIN client c ON i.clientId = c.id
      INNER JOIN work_item w ON w.invoiceId = i.id
      WHERE c.userId = ? ${clientFilter}
      GROUP BY c.current_currency_code, c.symbol
    `;

    // 5. Total hours (simple and fast)
    const totalHoursQuery = `
      SELECT SUM(w.hours) as totalHours
      FROM invoice i
      INNER JOIN client c ON i.clientId = c.id
      INNER JOIN work_item w ON w.invoiceId = i.id
      WHERE c.userId = ? ${clientFilter}
    `;

    // 6. Recent invoices (optimized - only last 10)
    const recentInvoicesQuery = `
      SELECT 
        i.id,
        i.date,
        c.name as client,
        i.status,
        c.current_currency_code as currency,
        c.symbol,
        SUM(w.hours * w.rate) as amount,
        SUM(w.hours) as hours
      FROM invoice i
      INNER JOIN client c ON i.clientId = c.id
      INNER JOIN work_item w ON w.invoiceId = i.id
      WHERE c.userId = ? ${clientFilter}
      GROUP BY i.id, i.date, c.name, i.status, c.current_currency_code, c.symbol
      ORDER BY i.date DESC, i.id DESC
      LIMIT 10
    `;

    // 7. Total invoice count
    const totalInvoicesQuery = `
      SELECT COUNT(DISTINCT i.id) as totalInvoices
      FROM invoice i
      INNER JOIN client c ON i.clientId = c.id
      WHERE c.userId = ? ${clientFilter}
    `;

    // Execute all queries in parallel for maximum performance
    const [
      monthlyIncomeRaw,
      clientIncomeRaw,
      statusSummaryRaw,
      currencyBreakdownRaw,
      totalHoursRaw,
      recentInvoicesRaw,
      totalInvoicesRaw
    ] = await Promise.all([
      manager.query(monthlyIncomeQuery, baseParams),
      manager.query(clientIncomeQuery, baseParams),
      manager.query(statusSummaryQuery, baseParams),
      manager.query(currencyBreakdownQuery, baseParams),
      manager.query(totalHoursQuery, baseParams),
      manager.query(recentInvoicesQuery, baseParams),
      manager.query(totalInvoicesQuery, baseParams)
    ]);

    // Transform monthly income data
    const monthlyIncomeMap = {};
    monthlyIncomeRaw.forEach(row => {
      const key = `${row.month}-${row.currency}`;
      if (!monthlyIncomeMap[key]) {
        monthlyIncomeMap[key] = {
          month: row.month,
          currency: row.currency,
          symbol: row.symbol,
          pending: 0,
          released: 0,
          received: 0,
          total: 0,
          hours: 0
        };
      }
      const amount = roundCurrency(parseFloat(row.amount));
      const hours = toNumber(row.hours);
      monthlyIncomeMap[key][row.status] = amount;
      monthlyIncomeMap[key].total += amount;
      monthlyIncomeMap[key].hours += hours;
    });

    // Transform client income data
    const clientIncomeMap = {};
    clientIncomeRaw.forEach(row => {
      const key = `${row.client}-${row.currency}`;
      if (!clientIncomeMap[key]) {
        clientIncomeMap[key] = {
          client: row.client,
          currency: row.currency,
          symbol: row.symbol,
          pending: 0,
          released: 0,
          received: 0,
          total: 0,
          hours: 0
        };
      }
      const amount = roundCurrency(parseFloat(row.amount));
      const hours = toNumber(row.hours);
      clientIncomeMap[key][row.status] = amount;
      clientIncomeMap[key].total += amount;
      clientIncomeMap[key].hours += hours;
    });

    // Transform status summary data
    const statusSummaryMap = {};
    statusSummaryRaw.forEach(row => {
      if (!statusSummaryMap[row.currency]) {
        statusSummaryMap[row.currency] = {
          currency: row.currency,
          symbol: row.symbol,
          pending: 0,
          released: 0,
          received: 0,
          total: 0
        };
      }
      const amount = roundCurrency(parseFloat(row.amount));
      statusSummaryMap[row.currency][row.status] = amount;
      statusSummaryMap[row.currency].total += amount;
    });

    // Transform currency breakdown (already aggregated)
    const currencyBreakdown = currencyBreakdownRaw.map(row => ({
      currency: row.currency,
      symbol: row.symbol,
      totalAmount: roundCurrency(parseFloat(row.totalAmount)),
      invoiceCount: parseInt(row.invoiceCount)
    }));

    // Transform recent invoices (already aggregated)
    const recentInvoices = recentInvoicesRaw.map(row => ({
      id: row.id,
      date: row.date,
      client: row.client,
      status: row.status,
      amount: roundCurrency(parseFloat(row.amount)),
      currency: row.currency,
      symbol: row.symbol,
      hours: toNumber(row.hours)
    }));

    return {
      monthlyIncome: Object.values(monthlyIncomeMap),
      clientIncome: Object.values(clientIncomeMap),
      statusSummary: Object.values(statusSummaryMap),
      currencyBreakdown,
      totalHours: toNumber(totalHoursRaw[0]?.totalHours) || 0,
      recentInvoices,
      totalInvoices: parseInt(totalInvoicesRaw[0]?.totalInvoices) || 0,
      note: "Amounts are shown in their original currencies. Optimized with database-level aggregation.",
      filteredBy: clientId ? { clientId } : { userId }
    };
  }

  async generatePdfInvoice(
    invoiceId: number,
    userId: number,
    host: string,
  ): Promise<string> {
    const baseFont = "Helvetica";
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
        client: {
          userId,
        },
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
      .font(`${baseFont}-Bold`)
      .fillColor(headlineColor)
      .text(`INVOICE`, 20, 20, { align: "left" }); // Position within the header

    doc
      .fontSize(12)
      .fillColor(headlineColor)
      .font(`${baseFont}-Bold`)
      .text(`Invoice #: ${invoice.invoiceNumber}`);

    doc
      .fontSize(12)
      .fillColor(headlineColor)
      .font(`${baseFont}-Bold`)
      .text(`Date: ${formatDate(invoice.date)}`);

    doc.moveDown(3);

    // Billed to section
    doc
      .fontSize(18)
      .fillColor(textColor)
      .font(`${baseFont}-Bold`)
      .text(`Billed to:`);

    doc
      .fontSize(14)
      .font(`${baseFont}-Bold`)
      .font(`${baseFont}`)
      .text(currentClient.name);

    doc.fontSize(12).font(`${baseFont}`).text(currentClient.address);

    doc.moveDown();

    // Developer section
    doc.fontSize(18).font(`${baseFont}-Bold`).text(`From:`);

    doc
      .fontSize(14)
      .font(`${baseFont}-Bold`)
      .font(`${baseFont}`)
      .text(user.name);
    doc.fontSize(10).font(`${baseFont}`).text(user.address);
    doc.fontSize(10).font(`${baseFont}`).text(user.email);

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

    doc
      .fontSize(10)
      .font(`${baseFont}-Oblique`)
      .text(
        `Note: This is a monthly auto-generated invoice from ${user.name}. For any questions or assistance, please reach out to me directly at ${user.email}. Thank you for the ongoing collaboration!`,
      );

    doc.moveDown(3);

    const clientRate = toNumber(currentClient.hourly_rate);
    const totalAmount = roundCurrency(
      workItems.reduce((sum, item) => {
        return sum + toNumber(item.hours) * clientRate;
      }, 0)
    );

    const totalHours = workItems.reduce((sum, item) => {
      return sum + item.hours;
    }, 0);

    const rows = workItems.map((item) => {
      const itemHours = toNumber(item.hours);
      const itemTotal = roundCurrency(itemHours * clientRate);
      return [
        item.title,
        item.description,
        itemHours,
        `${currentClient.symbol} ${roundCurrency(clientRate).toFixed(2)}`,
        `${currentClient.symbol} ${itemTotal.toFixed(2)}`,
      ];
    });

    rows.push([
      "",
      "",
      "",
      "Total:",
      `${currentClient.symbol}${totalAmount.toFixed(2)}`,
    ]);

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
      const itemHours = toNumber(item.hours);
      return [
        item.entry_date.toDateString(),
        item.title,
        `"${item.description}"`,
        itemHours,
        roundCurrency(clientRate).toFixed(2),
        roundCurrency(itemHours * clientRate).toFixed(2),
      ];
    });

    // Convert rows array to CSV format
    const csvContent = [
      headers.join(","), // Join headers with commas
      ...timesheetRows.map((row) => row.join(",")), // Map each row array to a comma-separated string
    ].join("\n"); // Join each line with newline characters

    const table = {
      title: "Overview",
      subtitle: `Total Hours: ${totalHours}, Total Amount ${currentClient.symbol} ${totalAmount.toFixed(2)}`,
      headers: ["Item", "Description", "Hours", "Rate", "Amount"],
      rows: rows,
    };

    await doc.table(table, {
      width: 550,
    });

    doc.moveDown(3);

    // doc
    //   .rect(0, doc.page.height - 120, doc.page.width, 120) // Rectangle from the bottom-left corner spanning the full width of the page
    //   .fill(bannerColor); // Change to your desired footer color

    // doc.moveDown();

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
