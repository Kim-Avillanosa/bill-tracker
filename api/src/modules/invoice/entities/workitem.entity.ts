import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Invoice } from "./invoice.entity"; // Adjust the import path as needed
import { decimalTransformer } from "../../../lib/decimalTransformer";

@Entity()
export class WorkItem {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    nullable: false,
  })
  entry_date: Date;
  
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  tags: string;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  hours: number;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  rate: number;

  @Column()
  invoiceId?: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.workItems)
  @JoinColumn({ name: "invoiceId" })
  invoice?: Invoice;
}
