import { MigrationInterface, QueryRunner } from "typeorm";

export class ReferrenceOnRelease1730609224080 implements MigrationInterface {
    name = 'ReferrenceOnRelease1730609224080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoice\` ADD \`referrenceNumber\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoice\` DROP COLUMN \`referrenceNumber\``);
    }

}
