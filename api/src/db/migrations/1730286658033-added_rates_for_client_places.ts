import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRatesForClientPlaces1730286658033 implements MigrationInterface {
    name = 'AddedRatesForClientPlaces1730286658033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`hourlyRate\``);
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`hoursPerDay\``);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`hourly_rate\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`hours_per_day\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`hours_per_day\``);
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`hourly_rate\``);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`hoursPerDay\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`hourlyRate\` decimal NOT NULL`);
    }

}
