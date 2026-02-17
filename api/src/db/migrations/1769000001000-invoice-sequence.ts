import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceSequence1769000001000 implements MigrationInterface {
  name = "InvoiceSequence1769000001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `invoice_sequence` (`id` int NOT NULL AUTO_INCREMENT, `clientId` int NOT NULL, `year` int NOT NULL, `currentValue` int NOT NULL DEFAULT 0, UNIQUE INDEX `UQ_invoice_sequence_client_year` (`clientId`, `year`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `invoice_sequence`");
  }
}
