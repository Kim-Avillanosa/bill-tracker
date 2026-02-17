import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("audit_log")
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  action: string;

  @Column({ default: "" })
  resourceType: string;

  @Column({ default: 0 })
  resourceId: number;

  @Column({ type: "text", nullable: true })
  metadata?: string;

  @CreateDateColumn()
  createdAt: Date;
}
