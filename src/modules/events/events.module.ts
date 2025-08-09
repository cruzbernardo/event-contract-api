import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, EventClient, EventSupplier } from 'src/database/entities';
import { EventsService } from './domain/events.service';
import { EventsController } from './http/events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventSupplier, EventClient])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
