import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkitemHoursDecimal1769000000000 implements MigrationInterface {
  name = "WorkitemHoursDecimal1769000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `work_item` MODIFY `hours` decimal(10,2) NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `work_item` MODIFY `hours` int NOT NULL",
    );
  }
}
