import { MigrationInterface, QueryRunner } from "typeorm";

export class ChartPerformanceIndexes1740459070000 implements MigrationInterface {
    name = 'ChartPerformanceIndexes1740459070000'

    private async createIndexIfMissing(
        queryRunner: QueryRunner,
        table: string,
        indexName: string,
        columnsDefinition: string,
    ): Promise<void> {
        const existing = await queryRunner.query(
            `SHOW INDEX FROM \`${table}\` WHERE Key_name = '${indexName}'`,
        );

        if (!existing.length) {
            await queryRunner.query(
                `CREATE INDEX \`${indexName}\` ON \`${table}\` (${columnsDefinition})`,
            );
        }
    }

    private async dropIndexIfExists(
        queryRunner: QueryRunner,
        table: string,
        indexName: string,
    ): Promise<void> {
        const existing = await queryRunner.query(
            `SHOW INDEX FROM \`${table}\` WHERE Key_name = '${indexName}'`,
        );

        if (existing.length) {
            await queryRunner.query(`DROP INDEX \`${indexName}\` ON \`${table}\``);
        }
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Index for filtering clients by userId (most common filter)
        await this.createIndexIfMissing(
            queryRunner,
            "client",
            "IDX_client_userId",
            "`userId`",
        );
        
        // Index for joining invoices to clients
        await this.createIndexIfMissing(
            queryRunner,
            "invoice",
            "IDX_invoice_clientId",
            "`clientId`",
        );
        
        // Index for joining work items to invoices
        await this.createIndexIfMissing(
            queryRunner,
            "work_item",
            "IDX_workitem_invoiceId",
            "`invoiceId`",
        );
        
        // Index for date-based grouping and ordering
        await this.createIndexIfMissing(
            queryRunner,
            "invoice",
            "IDX_invoice_date",
            "`date`",
        );
        
        // Index for status filtering
        await this.createIndexIfMissing(
            queryRunner,
            "invoice",
            "IDX_invoice_status",
            "`status`",
        );
        
        // Composite index for the main chart query pattern
        await this.createIndexIfMissing(
            queryRunner,
            "invoice",
            "IDX_invoice_date_status",
            "`date`, `status`",
        );
        
        // Composite index for client filtering with currency
        await this.createIndexIfMissing(
            queryRunner,
            "client",
            "IDX_client_userId_currency",
            "`userId`, `current_currency_code`",
        );
        
        // Composite index for recent invoices query
        await this.createIndexIfMissing(
            queryRunner,
            "invoice",
            "IDX_invoice_date_id_desc",
            "`date` DESC, `id` DESC",
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await this.dropIndexIfExists(queryRunner, "client", "IDX_client_userId");
        await this.dropIndexIfExists(queryRunner, "invoice", "IDX_invoice_clientId");
        await this.dropIndexIfExists(queryRunner, "work_item", "IDX_workitem_invoiceId");
        await this.dropIndexIfExists(queryRunner, "invoice", "IDX_invoice_date");
        await this.dropIndexIfExists(queryRunner, "invoice", "IDX_invoice_status");
        await this.dropIndexIfExists(queryRunner, "invoice", "IDX_invoice_date_status");
        await this.dropIndexIfExists(queryRunner, "client", "IDX_client_userId_currency");
        await this.dropIndexIfExists(queryRunner, "invoice", "IDX_invoice_date_id_desc");
    }
}