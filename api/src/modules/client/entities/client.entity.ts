import { EncryptionTransformer } from "typeorm-encrypted";
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

  @Column({
    default: "", nullable: false, transformer: new EncryptionTransformer({
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56',
    }),
  })
  email: string;

  @Column({
    default: "", nullable: false, transformer: new EncryptionTransformer({
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56',
    }),
  })
  name: string;

  @Column({
    default: "", nullable: false, transformer: new EncryptionTransformer({
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56',
    }),
  })
  symbol: string;

  @Column({
    default: "USD", nullable: false, transformer: new EncryptionTransformer({
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56',
    }),
  })
  current_currency_code: string;

  @Column({
    default: "PHP", nullable: false, transformer: new EncryptionTransformer({
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56',
    }),
  })
  convert_currency_code: string;

  @Column({
    default: "", nullable: false, transformer: new EncryptionTransformer({
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56',
    }),
  })
  code: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  hourly_rate: number;

  @Column()
  hours_per_day: number;

  @Column({
    nullable: true, transformer: new EncryptionTransformer({
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56',
    }),
  })
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
