import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuditLog } from "./entities/audit-log.entity";

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async findByUser(userId: number, limit = 50, offset = 0) {
    const take = Math.min(Math.max(limit || 50, 1), 200);
    const skip = Math.max(offset || 0, 0);

    return this.auditLogRepository.find({
      where: { userId },
      order: { id: "DESC" },
      take,
      skip,
    });
  }
}
