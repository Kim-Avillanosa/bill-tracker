import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { JWTUtil } from "../../jwt/jwt.service";
import { TimeSheet } from "./entities/timesheet.entity";
import { TimeSheetController } from "./timesheet.controller";
import { TimeSheetService } from "./timesheet.service";
import { Client } from "../client/entities/client.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Client, TimeSheet])],
  controllers: [TimeSheetController],
  providers: [TimeSheetService, JWTUtil],
})
export class TimeSheetModule {}
