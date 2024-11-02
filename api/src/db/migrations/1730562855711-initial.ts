import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1730562855711 implements MigrationInterface {
    name = 'Initial1730562855711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`work_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`entry_date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`tags\` varchar(255) NOT NULL, \`hours\` int NOT NULL, \`rate\` decimal(10,2) NOT NULL, \`invoiceId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`time_sheet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`entry_date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`summary\` varchar(255) NOT NULL DEFAULT '', \`tags\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`clientId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`bank_name\` varchar(255) NOT NULL, \`bank_swift_code\` varchar(255) NOT NULL, \`bank_account_number\` varchar(255) NOT NULL, \`bank_account_name\` varchar(255) NOT NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`client\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL DEFAULT '', \`name\` varchar(255) NOT NULL DEFAULT '', \`symbol\` varchar(255) NOT NULL DEFAULT '', \`code\` varchar(255) NOT NULL DEFAULT '', \`hourly_rate\` decimal(10,2) NOT NULL, \`hours_per_day\` int NOT NULL, \`address\` varchar(255) NULL, \`banner_color\` varchar(255) NULL DEFAULT '#1e90ff', \`headline_color\` varchar(255) NULL DEFAULT '#ffffff', \`text_color\` varchar(255) NULL DEFAULT '#1e272e', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, \`category\` enum ('FULL_TIME', 'PART_TIME') NOT NULL DEFAULT 'FULL_TIME', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`invoice\` (\`id\` int NOT NULL AUTO_INCREMENT, \`invoiceNumber\` varchar(255) NOT NULL, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`note\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'pending', \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`clientId\` int NOT NULL, UNIQUE INDEX \`IDX_d7bed97fb47876e03fd7d7c285\` (\`invoiceNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`work_item\` ADD CONSTRAINT \`FK_16e91dfd26443bfa19f476abc60\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoice\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` ADD CONSTRAINT \`FK_10fddeca96ad7a85e917d977fa5\` FOREIGN KEY (\`clientId\`) REFERENCES \`client\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD CONSTRAINT \`FK_ad3b4bf8dd18a1d467c5c0fc13a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invoice\` ADD CONSTRAINT \`FK_f18e9b95fe80b1f554d1cb6c23b\` FOREIGN KEY (\`clientId\`) REFERENCES \`client\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoice\` DROP FOREIGN KEY \`FK_f18e9b95fe80b1f554d1cb6c23b\``);
        await queryRunner.query(`ALTER TABLE \`client\` DROP FOREIGN KEY \`FK_ad3b4bf8dd18a1d467c5c0fc13a\``);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` DROP FOREIGN KEY \`FK_10fddeca96ad7a85e917d977fa5\``);
        await queryRunner.query(`ALTER TABLE \`work_item\` DROP FOREIGN KEY \`FK_16e91dfd26443bfa19f476abc60\``);
        await queryRunner.query(`DROP INDEX \`IDX_d7bed97fb47876e03fd7d7c285\` ON \`invoice\``);
        await queryRunner.query(`DROP TABLE \`invoice\``);
        await queryRunner.query(`DROP TABLE \`client\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`time_sheet\``);
        await queryRunner.query(`DROP TABLE \`work_item\``);
    }

}
