import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { WorkItem } from "./workitem.entity"; // Adjust the import path as needed
import { Client } from "src/modules/client/entities/client.entity";

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoiceNumber: string;

  @CreateDateColumn()
  date: Date;

  @Column()
  description: string;

  @OneToMany(() => WorkItem, (workItem) => workItem.invoice, { cascade: true })
  workItems: WorkItem[];

  @Column({ default: "pending" })
  status: "pending" | "paid" | "overdue";

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column()
  clientId: number;

  @ManyToOne(() => Client, (client) => client)
  @JoinColumn({ name: "clientId" })
  client: Client;
}
