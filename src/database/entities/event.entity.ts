// event.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { EventClient } from './eventClient.entity';
import { EventSupplier } from './eventSuppliers.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column({ nullable: true })
  venue: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalBudget: number;

  @ManyToOne(() => User, (user) => user.events)
  planner: User;

  @Column()
  plannerId: string;

  @OneToMany(() => EventClient, (eventClient) => eventClient.event)
  eventClients: EventClient[];

  @OneToMany(() => EventSupplier, (eventSupplier) => eventSupplier.event)
  eventSuppliers: EventSupplier[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
