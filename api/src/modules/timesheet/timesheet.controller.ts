import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { JWTUtil } from "../../jwt/jwt.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { TimeSheetService } from "./timesheet.service";
import { TimeSheetDto } from "./dto/timesheet.dto";

@SkipThrottle()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("client")
@ApiTags("Time sheet")
export class TimeSheetController {
  constructor(
    private readonly timesheetService: TimeSheetService,
    private readonly jwtUtil: JWTUtil,
  ) {}

  @Post(":id/timesheet/add")
  add(@Param("id") id: number, @Body() createClientDto: TimeSheetDto) {
    return this.timesheetService.createTimeSheet(id, {
      ...createClientDto,
    });
  }
  @Get(":id/timesheet/list")
  findOne(
    @Param("id") id: number,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.timesheetService.findAll(id, start, end);
  }

  @Patch("timesheet/:id")
  updateClient(@Param("id") id: number, @Body() updateClientDto: TimeSheetDto) {
    return this.timesheetService.updateTimesheet(+id, updateClientDto);
  }

  @Delete("timesheet/:id")
  deleteClient(@Param("id") id: string) {
    return this.timesheetService.deleteTimesheet(+id);
  }
}
