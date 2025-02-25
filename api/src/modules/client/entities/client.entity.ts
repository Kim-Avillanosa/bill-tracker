import { Invoice } from "../../invoice/entities/invoice.entity";
import { TimeSheet } from "../../timesheet/entities/timesheet.entity";
import { User } from "../../users/entities/user.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

export enum ClientCategory {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
}

@Entity()
export class Client {
  //primary key for every tables
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: "", nullable: false })
  email: string;

  @Column({ default: "", nullable: false })
  name: string;

  @Column({ default: "", nullable: false })
  symbol: string;

  @Column({ default: "USD", nullable: false })
  current_currency_code: string;

  @Column({ default: "PHP", nullable: false })
  convert_currency_code: string;

  @Column({ default: "", nullable: false })
  code: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  hourly_rate: number;

  @Column()
  hours_per_day: number;

  @Column({ default: 5 })
  days_per_week: number;

  @Column({ nullable: true })
  address: string;

  @Column({ default: "#1e90ff", nullable: true })
  banner_color: string;

  @Column({ default: "#ffffff", nullable: true })
  headline_color: string;

  @Column({ default: "#1e272e", nullable: true })
  text_color: string;

  @CreateDateColumn()
  created_at?: Date; // Creation date

  @UpdateDateColumn()
  updated_at?: Date; // Last updated date

  @Column()
  userId: number;

  @Column({
    type: "enum",
    enum: ClientCategory,
    default: ClientCategory.FULL_TIME,
  })
  category: ClientCategory; // Last updated date

  @ManyToOne(() => User, (user) => user.clients)
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];

  @OneToMany(() => TimeSheet, (timesheet) => timesheet.client)
  timesheets: TimeSheet[];
}
