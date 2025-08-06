// supplier.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Contract } from './contract.entity';
import { EventSupplier } from './eventSuppliers.entity';

export enum SupplierCategory {
  VENUE = 'venue',
  CATERING = 'catering',
  PHOTOGRAPHY = 'photography',
  FLORIST = 'florist',
  MUSIC = 'music',
  DECORATION = 'decoration',
  TRANSPORTATION = 'transportation',
  OTHER = 'other',
}

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: SupplierCategory })
  category: SupplierCategory;

  @Column()
  contactName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  instagramUrl: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @OneToMany(() => EventSupplier, (eventSupplier) => eventSupplier.supplier)
  eventSuppliers: EventSupplier[];

  @OneToMany(() => Contract, (contract) => contract.supplier)
  contracts: Contract[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
