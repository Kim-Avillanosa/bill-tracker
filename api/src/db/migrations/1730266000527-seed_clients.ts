import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedClients1730266000527 implements MigrationInterface {
    name = 'SeedClients1730266000527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` CHANGE \`name\` \`name\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`client\` CHANGE \`address\` \`address\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` CHANGE \`address\` \`address\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`client\` CHANGE \`name\` \`name\` varchar(255) NOT NULL`);
    }

}
