import { ApiProperty } from '@nestjs/swagger';
import type { ContractStatus, RequestCreateContract, RequestUpdateContract, ResponseContract } from '../interfaces';

export class CreateContractModel implements RequestCreateContract {
  @ApiProperty()
  eventSupplierId: string;

  @ApiProperty({ enum: ['pending', 'signed', 'cancelled'], required: false })
  status?: ContractStatus;

  @ApiProperty({ required: false })
  contractDocumentUrl?: string;

  @ApiProperty({ required: false })
  depositAmount?: number;

  @ApiProperty({ required: false })
  depositPaid?: boolean;

  @ApiProperty({ required: false })
  dueDate?: Date;

  @ApiProperty({ required: false })
  terms?: string;

  @ApiProperty({ required: false })
  notes?: string;
}

export class UpdateContractModel implements RequestUpdateContract {
  @ApiProperty({ required: false })
  eventSupplierId?: string;
  @ApiProperty({ enum: ['pending', 'signed', 'cancelled'], required: false })
  status?: ContractStatus;
  @ApiProperty({ required: false })
  contractDocumentUrl?: string;
  @ApiProperty({ required: false })
  depositAmount?: number;
  @ApiProperty({ required: false })
  depositPaid?: boolean;
  @ApiProperty({ required: false })
  dueDate?: Date;
  @ApiProperty({ required: false })
  terms?: string;
  @ApiProperty({ required: false })
  notes?: string;
}

export class ContractModel implements ResponseContract {
  @ApiProperty()
  id: string;
  @ApiProperty()
  status: ContractStatus;
  @ApiProperty({ required: false })
  contractDocumentUrl?: string;
  @ApiProperty({ required: false })
  depositAmount?: number;
  @ApiProperty()
  depositPaid: boolean;
  @ApiProperty({ required: false })
  dueDate?: Date;
  @ApiProperty({ required: false })
  terms?: string;
  @ApiProperty({ required: false })
  notes?: string;
  @ApiProperty({ required: false })
  eventSupplierId?: string;
  @ApiProperty({ required: false })
  supplierId?: string;
}


