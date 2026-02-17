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
  add(@Param("id") id: number, @Body() createClientDto: TimeSheetDto, @Req() req) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.timesheetService.createTimeSheet(id, token.sub, {
      ...createClientDto,
    });
  }
  @Get(":id/timesheet/list")
  findOne(
    @Param("id") id: number,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
    @Req() req,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.timesheetService.findAll(id, token.sub, start, end, {
      limit,
      offset,
    });
  }

  @Patch("timesheet/:id")
  updateClient(@Param("id") id: number, @Body() updateClientDto: TimeSheetDto, @Req() req) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.timesheetService.updateTimesheet(+id, token.sub, updateClientDto);
  }

  @Delete("timesheet/:id")
  deleteClient(@Param("id") id: string, @Req() req) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.timesheetService.deleteTimesheet(+id, token.sub);
  }
}
