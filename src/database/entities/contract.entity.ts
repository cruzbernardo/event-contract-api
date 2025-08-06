// contract.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Supplier } from './supplier.entity';
import { EventSupplier } from './eventSuppliers.entity';

export enum ContractStatus {
  PENDING = 'pending',
  SENT = 'sent',
  SIGNED = 'signed',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.PENDING,
  })
  status: ContractStatus;

  @Column({ nullable: true })
  contractDocumentUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  depositAmount: number;

  @Column({ default: false })
  depositPaid: boolean;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'text', nullable: true })
  terms: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.contracts)
  supplier: Supplier;

  @OneToOne(() => EventSupplier, (eventSupplier) => eventSupplier.contract)
  @JoinColumn()
  eventSupplier: EventSupplier;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
