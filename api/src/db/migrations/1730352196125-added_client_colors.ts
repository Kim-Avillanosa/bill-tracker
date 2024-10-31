import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedClientColors1730352196125 implements MigrationInterface {
    name = 'AddedClientColors1730352196125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`banner_color\` varchar(255) NULL DEFAULT '#1e90ff'`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`headline_color\` varchar(255) NULL DEFAULT '#ffffff'`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`text_color\` varchar(255) NULL DEFAULT '#1e272e'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`text_color\``);
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`headline_color\``);
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`banner_color\``);
    }

}
