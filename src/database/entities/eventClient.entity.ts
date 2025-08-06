import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from './user.entity';

@Entity('event_clients')
export class EventClient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.eventClients)
  event: Event;

  @ManyToOne(() => User, (user) => user.clientEvents)
  client: User;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
