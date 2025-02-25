import { MigrationInterface, QueryRunner } from "typeorm";

export class HoursPerDay1740459069404 implements MigrationInterface {
    name = 'HoursPerDay1740459069404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`current_currency_symbol\``);
        // await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`convert_currency_symbol\``);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`days_per_week\` int NOT NULL DEFAULT '5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`days_per_week\``);
        // await queryRunner.query(`ALTER TABLE \`client\` ADD \`convert_currency_symbol\` varchar(255) NOT NULL DEFAULT 'PHP'`);
        // await queryRunner.query(`ALTER TABLE \`client\` ADD \`current_currency_symbol\` varchar(255) NOT NULL DEFAULT 'USD'`);
    }

}
