import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Invoice } from "./invoice.entity"; // Adjust the import path as needed

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

  @Column("int")
  hours: number;

  @Column("decimal", { precision: 10, scale: 2 })
  rate: number;

  @Column()
  invoiceId?: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.workItems)
  @JoinColumn({ name: "invoiceId" })
  invoice?: Invoice;
}
