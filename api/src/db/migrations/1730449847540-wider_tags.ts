import { MigrationInterface, QueryRunner } from "typeorm";

export class WiderTags1730449847540 implements MigrationInterface {
    name = 'WiderTags1730449847540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`time_sheet\` ADD \`tags\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`time_sheet\` DROP COLUMN \`tags\``);
    }

}
