import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, EventClient, EventSupplier } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventSupplier, EventClient])],
})
export class EventsModule {}
