import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventClient, EventSupplier, User } from 'src/database/entities';
import { Logger } from 'winston';
import { UserRequestWithData } from 'src/shared/interfaces';
import {
  RequestCreateEvent,
  RequestInviteClient,
  RequestAttachSupplier,
  ResponseEventDetails,
} from '../http/interfaces';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(EventClient)
    private readonly eventClientRepository: Repository<EventClient>,

    @InjectRepository(EventSupplier)
    private readonly eventSupplierRepository: Repository<EventSupplier>,

    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async create(
    request: UserRequestWithData,
    data: RequestCreateEvent,
  ): Promise<Event> {
    const event = this.eventRepository.create({
      name: data.name,
      description: data.description,
      eventDate: data.eventDate,
      venue: data.venue,
      totalBudget: data.totalBudget ?? 0,
      plannerId: request.user.id,
    });

    const saved = await this.eventRepository.save(event);
    this.logger.info(`Event created id=${saved.id} by user=${request.user.id}`, {
      context: EventsService.name,
    });
    return saved;
  }

  async inviteClient(
    eventId: string,
    data: RequestInviteClient,
  ): Promise<EventClient> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const eventClient = this.eventClientRepository.create({
      event: { id: event.id } as Event,
      client: { id: data.clientUserId } as User,
    });

    const saved = await this.eventClientRepository.save(eventClient);
    this.logger.info(`Client ${data.clientUserId} invited to event ${eventId}`, {
      context: EventsService.name,
    });
    return saved;
  }

  async attachSupplier(
    eventId: string,
    data: RequestAttachSupplier,
  ): Promise<EventSupplier> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const newEventSupplier = this.eventSupplierRepository.create({
      event: { id: event.id } as Event,
      supplier: { id: data.supplierId } as any,
      agreedPrice: data.agreedPrice,
      notes: data.notes,
    });
    const saved = await this.eventSupplierRepository.save(newEventSupplier);
    this.logger.info(`Supplier ${data.supplierId} attached to event ${eventId}`, {
      context: EventsService.name,
    });
    return saved;
  }

  async getById(
    eventId: string,
    request?: UserRequestWithData,
  ): Promise<ResponseEventDetails> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: {
        eventClients: { client: true },
        eventSuppliers: { supplier: true, contract: true },
        planner: true,
      } as any,
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // RBAC granular: se cliente, precisa estar convidado; se supplier no futuro, validar owner
    if (request?.user?.role === 'client') {
      const invited = (event.eventClients || []).some(
        (ec) => (ec.client as any)?.id === request.user.id,
      );
      if (!invited) {
        throw new NotFoundException('Event not found');
      }
    }

    return {
      id: event.id,
      name: event.name,
      description: event.description,
      eventDate: event.eventDate,
      venue: event.venue,
      totalBudget: Number(event.totalBudget) as unknown as number,
      plannerId: event.plannerId,
      clients: (event.eventClients ?? []).map((ec) => ({
        id: ec.client?.id,
        email: (ec.client as any)?.email,
      })),
      suppliers: (event.eventSuppliers ?? []).map((es) => ({
        id: es.supplier?.id,
        name: (es.supplier as any)?.name,
        agreedPrice: Number(es.agreedPrice) as unknown as number,
        eventSupplierId: es.id,
        contractId: (es.contract as any)?.id,
      })),
    };
  }

  async listMine(request: UserRequestWithData): Promise<ResponseEventDetails[]> {
    const events = await this.eventRepository.find({
      where: { plannerId: request.user.id },
      relations: {
        eventSuppliers: { supplier: true },
        eventClients: { client: true },
      } as any,
    });

    return events.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      eventDate: event.eventDate,
      venue: event.venue,
      totalBudget: Number(event.totalBudget) as unknown as number,
      plannerId: event.plannerId,
      clients: (event.eventClients ?? []).map((ec) => ({
        id: ec.client?.id,
        email: (ec.client as any)?.email,
      })),
      suppliers: (event.eventSuppliers ?? []).map((es) => ({
        id: es.supplier?.id,
        name: (es.supplier as any)?.name,
        agreedPrice: Number(es.agreedPrice) as unknown as number,
        eventSupplierId: es.id,
        contractId: (es.contract as any)?.id,
      })),
    }));
  }
}


