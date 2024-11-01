import { Client } from "../../client/entities/client.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity()
export class TimeSheet {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    nullable: false,
  })
  entry_date: Date;

  @Column({ default: "", nullable: false })
  summary: string;

  @Column({ type: "text", nullable: false })
  tags: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @Column()
  clientId: number;

  @ManyToOne(() => Client, (client) => client.timesheets)
  @JoinColumn({ name: "clientId" })
  client: Client;
}
