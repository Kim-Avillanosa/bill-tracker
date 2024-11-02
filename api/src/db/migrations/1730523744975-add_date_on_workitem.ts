import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDateOnWorkitem1730523744975 implements MigrationInterface {
    name = 'AddDateOnWorkitem1730523744975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`work_item\` ADD \`entry_date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`work_item\` DROP FOREIGN KEY \`FK_16e91dfd26443bfa19f476abc60\``);
        await queryRunner.query(`ALTER TABLE \`work_item\` CHANGE \`invoiceId\` \`invoiceId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` DROP COLUMN \`tags\``);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` ADD \`tags\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`work_item\` ADD CONSTRAINT \`FK_16e91dfd26443bfa19f476abc60\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoice\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`work_item\` DROP FOREIGN KEY \`FK_16e91dfd26443bfa19f476abc60\``);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` DROP COLUMN \`tags\``);
        await queryRunner.query(`ALTER TABLE \`time_sheet\` ADD \`tags\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`work_item\` CHANGE \`invoiceId\` \`invoiceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`work_item\` ADD CONSTRAINT \`FK_16e91dfd26443bfa19f476abc60\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoice\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`work_item\` DROP COLUMN \`entry_date\``);
    }

}
