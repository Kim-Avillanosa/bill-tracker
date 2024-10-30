import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Invoice } from "./invoice.entity"; // Adjust the import path as needed

@Entity()
export class WorkItem {
  @PrimaryGeneratedColumn()
  id?: number;

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

  @ManyToOne(() => Invoice, (invoice) => invoice.workItems)
  invoice?: Invoice;
}
