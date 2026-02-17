import { MigrationInterface, QueryRunner } from "typeorm";

export class AuditLog1769000002000 implements MigrationInterface {
  name = "AuditLog1769000002000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `audit_log` (`id` int NOT NULL AUTO_INCREMENT, `userId` int NOT NULL, `action` varchar(255) NOT NULL, `resourceType` varchar(255) NOT NULL DEFAULT '', `resourceId` int NOT NULL DEFAULT 0, `metadata` text NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_audit_user_action` ON `audit_log` (`userId`, `action`)",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP INDEX `IDX_audit_user_action` ON `audit_log`");
    await queryRunner.query("DROP TABLE `audit_log`");
  }
}
