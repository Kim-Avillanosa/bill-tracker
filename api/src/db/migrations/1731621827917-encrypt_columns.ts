import { MigrationInterface, QueryRunner } from "typeorm";

export class EncryptColumns1731621827917 implements MigrationInterface {
    name = 'EncryptColumns1731621827917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`current_currency_symbol\``);
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`convert_currency_symbol\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`convert_currency_symbol\` varchar(255) NOT NULL DEFAULT 'PHP'`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`current_currency_symbol\` varchar(255) NOT NULL DEFAULT 'USD'`);
    }

}
