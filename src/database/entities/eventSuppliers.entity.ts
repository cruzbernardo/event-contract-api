import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Supplier } from './supplier.entity';
import { Contract } from './contract.entity';

@Entity('event_suppliers')
export class EventSupplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.eventSuppliers)
  event: Event;

  @ManyToOne(() => Supplier, (supplier) => supplier.eventSuppliers)
  supplier: Supplier;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  agreedPrice: number;

  @Column({ nullable: true })
  notes: string;

  @OneToOne(() => Contract, (contract) => contract.eventSupplier)
  contract: Contract;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
