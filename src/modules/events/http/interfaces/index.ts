export interface RequestCreateEvent {
  name: string;
  description?: string;
  eventDate: Date;
  venue?: string;
  totalBudget?: number;
}

export interface RequestInviteClient {
  clientUserId: string;
}

export interface RequestAttachSupplier {
  supplierId: string;
  agreedPrice: number;
  notes?: string;
}

export interface ResponseEventDetails {
  id: string;
  name: string;
  description?: string;
  eventDate: Date;
  venue?: string;
  totalBudget: number;
  plannerId: string;
  clients: Array<{ id: string; email?: string }>;
  suppliers: Array<{
    id: string;
    name?: string;
    agreedPrice: number;
    eventSupplierId: string;
    contractId?: string;
  }>;
}


