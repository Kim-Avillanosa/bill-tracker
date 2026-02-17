import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { JWTUtil } from "../../jwt/jwt.service";
import { TimeSheet } from "../timesheet/entities/timesheet.entity";
import { Invoice } from "./entities/invoice.entity";
import { InvoiceController } from "./invoice.controller";
import { InvoiceService } from "./invoice.service";
import { Client } from "../client/entities/client.entity";
import { WorkItem } from "./entities/workitem.entity";
import { InvoiceSequence } from "./entities/invoice-sequence.entity";
import { AuditLog } from "../audit/entities/audit-log.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Invoice,
      Client,
      WorkItem,
      InvoiceSequence,
      AuditLog,
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, JWTUtil],
})
export class InvoiceModule {}
