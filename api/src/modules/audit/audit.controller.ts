import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { JWTUtil } from "../../jwt/jwt.service";
import { AuthGuard } from "../auth/auth.guard";
import { AuditService } from "./audit.service";

@SkipThrottle()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("audit")
@ApiTags("Audit")
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly jwtUtil: JWTUtil,
  ) {}

  @Get("me")
  findByUser(
    @Req() req,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.auditService.findByUser(token.sub, limit, offset);
  }
}
