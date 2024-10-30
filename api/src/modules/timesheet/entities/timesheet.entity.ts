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
  //primary key for every tables
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  entry_date: Date; 

  @Column({ default : "", nullable: false })
  summary: string;
 
  @CreateDateColumn()
  created_at?: Date; // Creation date

  @UpdateDateColumn()
  updated_at?: Date; // Last updated date

  @Column()
  clientId: number;

  @ManyToOne(() => Client, (client) => client.timesheets)
  @JoinColumn({ name: "clientId" })
  client: Client;
}
