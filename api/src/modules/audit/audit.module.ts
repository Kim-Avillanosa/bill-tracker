import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JWTUtil } from "../../jwt/jwt.service";
import { AuditController } from "./audit.controller";
import { AuditService } from "./audit.service";
import { AuditLog } from "./entities/audit-log.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditController],
  providers: [AuditService, JWTUtil],
  exports: [AuditService],
})
export class AuditModule {}
