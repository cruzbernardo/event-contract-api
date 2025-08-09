import { ApiProperty } from '@nestjs/swagger';
import {
  RequestAttachSupplier,
  RequestCreateEvent,
  RequestInviteClient,
  ResponseEventDetails,
} from '../interfaces';

export class CreateEventModel implements RequestCreateEvent {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  eventDate: Date;

  @ApiProperty({ required: false })
  venue?: string;

  @ApiProperty({ required: false })
  totalBudget?: number;
}

export class InviteClientModel implements RequestInviteClient {
  @ApiProperty()
  clientUserId: string;
}

export class AttachSupplierModel implements RequestAttachSupplier {
  @ApiProperty()
  supplierId: string;

  @ApiProperty()
  agreedPrice: number;

  @ApiProperty({ required: false })
  notes?: string;
}

export class EventDetailsModel implements ResponseEventDetails {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty()
  eventDate: Date;
  @ApiProperty({ required: false })
  venue?: string;
  @ApiProperty()
  totalBudget: number;
  @ApiProperty()
  plannerId: string;
  @ApiProperty({ type: () => [Object] })
  clients: Array<{ id: string; email?: string }>;
  @ApiProperty({ type: () => [Object] })
  suppliers: Array<{
    id: string;
    name?: string;
    agreedPrice: number;
    eventSupplierId: string;
    contractId?: string;
  }>;
}


