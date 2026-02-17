import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("invoice_sequence")
@Unique("UQ_invoice_sequence_client_year", ["clientId", "year"])
export class InvoiceSequence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @Column()
  year: number;

  @Column({ default: 0 })
  currentValue: number;
}
