import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1730305104654 implements MigrationInterface {
    name = 'Initial1730305104654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`work_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`tags\` varchar(255) NOT NULL, \`hours\` int NOT NULL, \`rate\` decimal(10,2) NOT NULL, \`invoiceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`time_sheet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`entry_date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`summary\` varchar(255) NOT NULL DEFAULT '', \`tags\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`clientId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`invoice\` (\`id\` int NOT NULL AUTO_INCREMENT, \`invoiceNumber\` varchar(255) NOT NULL, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`note\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'pending', \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`clientId\` int NOT NULL, UNIQUE INDEX \`IDX_d7bed97fb47876e03fd7d7c285\` (\`invoiceNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`work_item\` ADD CONSTRAINT \`FK_16e91dfd26443bfa19f476abc60\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoice\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` ADD CONSTRAINT \`FK_10fddeca96ad7a85e917d977fa5\` FOREIGN KEY (\`clientId\`) REFERENCES \`client\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invoice\` ADD CONSTRAINT \`FK_f18e9b95fe80b1f554d1cb6c23b\` FOREIGN KEY (\`clientId\`) REFERENCES \`client\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoice\` DROP FOREIGN KEY \`FK_f18e9b95fe80b1f554d1cb6c23b\``);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` DROP FOREIGN KEY \`FK_10fddeca96ad7a85e917d977fa5\``);
        await queryRunner.query(`ALTER TABLE \`work_item\` DROP FOREIGN KEY \`FK_16e91dfd26443bfa19f476abc60\``);
        await queryRunner.query(`DROP INDEX \`IDX_d7bed97fb47876e03fd7d7c285\` ON \`invoice\``);
        await queryRunner.query(`DROP TABLE \`invoice\``);
        await queryRunner.query(`DROP TABLE \`time_sheet\``);
        await queryRunner.query(`DROP TABLE \`work_item\``);
    }

}
