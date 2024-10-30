import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRatesForClientPlaces1730286494883 implements MigrationInterface {
    name = 'AddedRatesForClientPlaces1730286494883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` CHANGE \`hourlyRate\` \`hourlyRate\` decimal(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` CHANGE \`hourlyRate\` \`hourlyRate\` decimal(10,0) NOT NULL`);
    }

}
