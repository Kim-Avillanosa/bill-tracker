import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrencySymbols1730602898912 implements MigrationInterface {
    name = 'AddCurrencySymbols1730602898912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`current_currency_symbol\` varchar(255) NOT NULL DEFAULT 'USD'`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`convert_currency_symbol\` varchar(255) NOT NULL DEFAULT 'PHP'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`convert_currency_symbol\``);
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`current_currency_symbol\``);
    }

}
