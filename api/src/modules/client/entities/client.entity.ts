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

  @Column({ default : "", nullable: false })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  hourly_rate: number;

  @Column()
  hours_per_day: number;

  @Column({ nullable: true })
  address: string;

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


  @OneToMany(() => TimeSheet, (timesheet) => timesheet.client)
  timesheets: TimeSheet[];
}
