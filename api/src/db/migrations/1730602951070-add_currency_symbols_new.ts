import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrencySymbolsNew1730602951070 implements MigrationInterface {
    name = 'AddCurrencySymbolsNew1730602951070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`current_currency_code\` varchar(255) NOT NULL DEFAULT 'USD'`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`convert_currency_code\` varchar(255) NOT NULL DEFAULT 'PHP'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`convert_currency_code\``);
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`current_currency_code\``);
    }

}
