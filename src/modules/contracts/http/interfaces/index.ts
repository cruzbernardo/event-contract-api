export type ContractStatus = 'pending' | 'signed' | 'cancelled';

export interface RequestCreateContract {
  eventSupplierId: string;
  status?: ContractStatus;
  contractDocumentUrl?: string;
  depositAmount?: number;
  depositPaid?: boolean;
  dueDate?: Date;
  terms?: string;
  notes?: string;
}

export interface RequestUpdateContract extends Partial<RequestCreateContract> {}

export interface ResponseContract {
  id: string;
  status: ContractStatus;
  contractDocumentUrl?: string;
  depositAmount?: number;
  depositPaid: boolean;
  dueDate?: Date;
  terms?: string;
  notes?: string;
  eventSupplierId?: string;
  supplierId?: string;
}


