import { Body, Controller, Get, Inject, Param, Post, Req } from '@nestjs/common';
import { EventsService } from '../domain/events.service';
import type { UserRequestWithData } from 'src/shared/interfaces';
import type { RequestAttachSupplier, RequestCreateEvent, RequestInviteClient, ResponseEventDetails } from './interfaces';
import { Logger } from 'winston';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/validators/decorators';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,

    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @Post()
  @Roles('planner')
  create(
    @Req() req: UserRequestWithData,
    @Body() body: RequestCreateEvent,
  ) {
    return this.eventsService.create(req, body);
  }

  @Post(':eventId/invite-client')
  @Roles('planner')
  inviteClient(
    @Param('eventId') eventId: string,
    @Body() body: RequestInviteClient,
  ) {
    return this.eventsService.inviteClient(eventId, body);
  }

  @Post(':eventId/attach-supplier')
  @Roles('planner')
  attachSupplier(
    @Param('eventId') eventId: string,
    @Body() body: RequestAttachSupplier,
  ) {
    return this.eventsService.attachSupplier(eventId, body);
  }

  @Get(':eventId')
  getById(
    @Req() req: UserRequestWithData,
    @Param('eventId') eventId: string,
  ): Promise<ResponseEventDetails> {
    return this.eventsService.getById(eventId, req);
  }

  @Get()
  @Roles('planner')
  listMine(@Req() req: UserRequestWithData) {
    return this.eventsService.listMine(req);
  }
}


