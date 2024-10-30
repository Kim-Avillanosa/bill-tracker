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
  @Controller("timesheet")
  @ApiTags("timesheet")
  export class TimeSheetController {
    constructor(
      private readonly timesheetService: TimeSheetService,
      private readonly jwtUtil: JWTUtil,
    ) {}
  
    @Post(":clientId/add")
    add(@Param('clientId') clientId: number, @Body() createClientDto: TimeSheetDto) {
 
      return this.timesheetService.createTimeSheet(clientId, {
        ...createClientDto,
      });
    }
    @Get(':clientId/list')
    findOne(@Param('clientId') clientId: number) {
      return this.timesheetService.findOne(clientId);
    }

    @Patch(':id')
    updateClient(@Param('id') id: number, @Body() updateClientDto: TimeSheetDto) {
      return this.timesheetService.updateTimesheet(+id, updateClientDto);
    }
  
    @Delete(':id')
    deleteClient(@Param('id') id: string) {
      return this.timesheetService.deleteTimesheet(+id);
    }
  }
  