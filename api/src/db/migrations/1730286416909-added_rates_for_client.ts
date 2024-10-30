import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRatesForClient1730286416909 implements MigrationInterface {
    name = 'AddedRatesForClient1730286416909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`hourlyRate\``);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`hourlyRate\` decimal NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`hourlyRate\``);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`hourlyRate\` int NOT NULL`);
    }

}
