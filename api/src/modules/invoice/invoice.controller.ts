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
import { InvoiceService } from "./invoice.service";
import { InvoiceDTO } from "./dto/invoice.dto";

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

  @Post("write")
  add(@Body() invoiceDTO: InvoiceDTO, @Req() req) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.invoiceService.generateInvoice(token.sub, {
      ...invoiceDTO,
    });
  }

  @Post(":id/generate")
  generate(@Param('id') id: number) {
    return this.invoiceService.generatePdfInvoice(id);
  }
}
