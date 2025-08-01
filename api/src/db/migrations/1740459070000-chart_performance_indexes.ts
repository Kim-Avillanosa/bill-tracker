import { MigrationInterface, QueryRunner } from "typeorm";

export class ChartPerformanceIndexes1740459070000 implements MigrationInterface {
    name = 'ChartPerformanceIndexes1740459070000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Index for filtering clients by userId (most common filter)
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_client_userId\` ON \`client\` (\`userId\`)`);
        
        // Index for joining invoices to clients
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_invoice_clientId\` ON \`invoice\` (\`clientId\`)`);
        
        // Index for joining work items to invoices
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_workitem_invoiceId\` ON \`work_item\` (\`invoiceId\`)`);
        
        // Index for date-based grouping and ordering
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_invoice_date\` ON \`invoice\` (\`date\`)`);
        
        // Index for status filtering
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_invoice_status\` ON \`invoice\` (\`status\`)`);
        
        // Composite index for the main chart query pattern
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_invoice_date_status\` ON \`invoice\` (\`date\`, \`status\`)`);
        
        // Composite index for client filtering with currency
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_client_userId_currency\` ON \`client\` (\`userId\`, \`current_currency_code\`)`);
        
        // Composite index for recent invoices query
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_invoice_date_id_desc\` ON \`invoice\` (\`date\` DESC, \`id\` DESC)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_client_userId\` ON \`client\``);
        await queryRunner.query(`DROP INDEX \`IDX_invoice_clientId\` ON \`invoice\``);
        await queryRunner.query(`DROP INDEX \`IDX_workitem_invoiceId\` ON \`work_item\``);
        await queryRunner.query(`DROP INDEX \`IDX_invoice_date\` ON \`invoice\``);
        await queryRunner.query(`DROP INDEX \`IDX_invoice_status\` ON \`invoice\``);
        await queryRunner.query(`DROP INDEX \`IDX_invoice_date_status\` ON \`invoice\``);
        await queryRunner.query(`DROP INDEX \`IDX_client_userId_currency\` ON \`client\``);
        await queryRunner.query(`DROP INDEX \`IDX_invoice_date_id_desc\` ON \`invoice\``);
    }
}