import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedClientSymbol1730340872463 implements MigrationInterface {
    name = 'AddedClientSymbol1730340872463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`symbol\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`work_item\` DROP FOREIGN KEY \`FK_16e91dfd26443bfa19f476abc60\``);
        await queryRunner.query(`ALTER TABLE \`work_item\` CHANGE \`invoiceId\` \`invoiceId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`work_item\` ADD CONSTRAINT \`FK_16e91dfd26443bfa19f476abc60\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoice\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`work_item\` DROP FOREIGN KEY \`FK_16e91dfd26443bfa19f476abc60\``);
        await queryRunner.query(`ALTER TABLE \`work_item\` CHANGE \`invoiceId\` \`invoiceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`work_item\` ADD CONSTRAINT \`FK_16e91dfd26443bfa19f476abc60\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoice\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`symbol\``);
    }

}
