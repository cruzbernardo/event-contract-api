import { ApiProperty } from '@nestjs/swagger';
import { RequestCreateSupplier, ResponseSupplier } from '../interfaces';

export class CreateSupplierModel implements RequestCreateSupplier {
  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  contactName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ required: false })
  instagramUrl?: string;

  @ApiProperty({ required: false })
  websiteUrl?: string;
}

export class SupplierModel implements ResponseSupplier {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  category: string;
  @ApiProperty()
  contactName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty({ required: false })
  instagramUrl?: string;
  @ApiProperty({ required: false })
  websiteUrl?: string;
}


