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

@Module({
  imports: [TypeOrmModule.forFeature([User, Invoice, Client, WorkItem])],
  controllers: [InvoiceController],
  providers: [InvoiceService, JWTUtil],
})
export class InvoiceModule {}
