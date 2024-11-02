import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { JWTUtil } from "../../jwt/jwt.service";
import { TimeSheet } from "../timesheet/entities/timesheet.entity";
import { Client } from "../client/entities/client.entity";
import { InvoiceController } from "../invoice/invoice.controller";
import { FilesController } from "./files.controller";

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [FilesController],
  providers: [],
})
export class FilesModule {}
