import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1730555755078 implements MigrationInterface {
    name = 'Initial1730555755078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`client\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL DEFAULT '', \`name\` varchar(255) NOT NULL DEFAULT '', \`symbol\` varchar(255) NOT NULL DEFAULT '', \`code\` varchar(255) NOT NULL DEFAULT '', \`hourly_rate\` decimal(10,2) NOT NULL, \`hours_per_day\` int NOT NULL, \`address\` varchar(255) NULL, \`banner_color\` varchar(255) NULL DEFAULT '#1e90ff', \`headline_color\` varchar(255) NULL DEFAULT '#ffffff', \`text_color\` varchar(255) NULL DEFAULT '#1e272e', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, \`category\` enum ('FULL_TIME', 'PART_TIME') NOT NULL DEFAULT 'FULL_TIME', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`bank_name\` varchar(255) NOT NULL, \`bank_swift_code\` varchar(255) NOT NULL, \`bank_account_number\` varchar(255) NOT NULL, \`bank_account_name\` varchar(255) NOT NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`work_item\` ADD \`entry_date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`work_item\` DROP FOREIGN KEY \`FK_16e91dfd26443bfa19f476abc60\``);
        await queryRunner.query(`ALTER TABLE \`work_item\` CHANGE \`invoiceId\` \`invoiceId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` DROP COLUMN \`tags\``);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` ADD \`tags\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`work_item\` ADD CONSTRAINT \`FK_16e91dfd26443bfa19f476abc60\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoice\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invoice\` ADD CONSTRAINT \`FK_f18e9b95fe80b1f554d1cb6c23b\` FOREIGN KEY (\`clientId\`) REFERENCES \`client\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` ADD CONSTRAINT \`FK_10fddeca96ad7a85e917d977fa5\` FOREIGN KEY (\`clientId\`) REFERENCES \`client\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD CONSTRAINT \`FK_ad3b4bf8dd18a1d467c5c0fc13a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` DROP FOREIGN KEY \`FK_ad3b4bf8dd18a1d467c5c0fc13a\``);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` DROP FOREIGN KEY \`FK_10fddeca96ad7a85e917d977fa5\``);
        await queryRunner.query(`ALTER TABLE \`invoice\` DROP FOREIGN KEY \`FK_f18e9b95fe80b1f554d1cb6c23b\``);
        await queryRunner.query(`ALTER TABLE \`work_item\` DROP FOREIGN KEY \`FK_16e91dfd26443bfa19f476abc60\``);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` DROP COLUMN \`tags\``);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` ADD \`tags\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`work_item\` CHANGE \`invoiceId\` \`invoiceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`work_item\` ADD CONSTRAINT \`FK_16e91dfd26443bfa19f476abc60\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoice\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`work_item\` DROP COLUMN \`entry_date\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`client\``);
    }

}
