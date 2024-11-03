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
import { Client } from "../../client/entities/client.entity";

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoiceNumber: string;

  @CreateDateColumn()
  date: Date;

  @Column()
  note: string;

  @OneToMany(() => WorkItem, (workItem) => workItem.invoice, { cascade: true })
  workItems: WorkItem[];

  @Column({ default: "pending" })
  status: "pending" | "released" | "received";

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ default: "", nullable: false })
  referrenceNumber: string;

  @Column()
  clientId: number;

  @ManyToOne(() => Client, (client) => client)
  @JoinColumn({ name: "clientId" })
  client: Client;
}
