import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  Param,
  Get,
  Patch,
  Query,
  Delete,
} from "@nestjs/common";
import { JWTUtil } from "../../jwt/jwt.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { InvoiceService } from "./invoice.service";
import { InvoiceDTO, UpdateInvoiceDTO } from "./dto/invoice.dto";
import { Request } from "express";
@SkipThrottle()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("invoice")
@ApiTags("Invoice")
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly jwtUtil: JWTUtil,
  ) {}

  @Get("list/:userId")
  findAll(
    @Req() req,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
    @Query("status") status?: "pending" | "released" | "received",
    @Query("clientId") clientId?: number,
  ) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.invoiceService.findByUser(token.sub, {
      limit,
      offset,
      status,
      clientId,
    });
  }

  @Get("chart-summary/:userId")
  getChartSummary(
    @Req() req,
    @Query("clientId") clientId?: number,
  ) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.invoiceService.getChartSummary(token.sub, clientId);
  }

  @Get(":id")
  findOne(@Param("id") id: number, @Req() req) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.invoiceService.findOne(id, token.sub);
  }

  @Patch(":id/release")
  releaseInvoice(
    @Param("id") id: number,
    @Req() req,
    @Query("referrenceNumber") referrenceNumber: string,
  ) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.invoiceService.releaseInvoice(id, token.sub, referrenceNumber);
  }

  @Post("write")
  add(@Body() invoiceDTO: InvoiceDTO, @Req() req) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.invoiceService.generateInvoice(token.sub, {
      ...invoiceDTO,
    });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() invoiceDTO: UpdateInvoiceDTO, @Req() req) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.invoiceService.updateInvoice(+id, token.sub, invoiceDTO);
  }

  @Delete(":id")
  delete(@Param("id") id: string, @Req() req) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.invoiceService.deleteInvoice(+id, token.sub);
  }

  @Post(":id/generate")
  generate(@Req() req: Request, @Param("id") id: number) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.invoiceService.generatePdfInvoice(
      id,
      token.sub,
      `${req.protocol}://${req.get("Host")}`,
    );
  }
}
