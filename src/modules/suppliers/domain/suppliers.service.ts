import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from 'src/database/entities';
import { Logger } from 'winston';
import { RequestCreateSupplier, ResponseSupplier } from '../http/interfaces';
import { UserRequestWithData } from 'src/shared/interfaces';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,

    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async create(
    data: RequestCreateSupplier,
    req?: UserRequestWithData,
  ): Promise<ResponseSupplier> {
    const created = this.supplierRepository.create({
      name: data.name,
      category: (data.category as any),
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      instagramUrl: data.instagramUrl,
      websiteUrl: data.websiteUrl,
      ownerUser: req?.user?.id ? ({ id: req.user.id } as any) : undefined,
    } as any);
    const saved = (await this.supplierRepository.save(created)) as any;
    this.logger.info(`Supplier created id=${saved.id}`, {
      context: SuppliersService.name,
    });
    return saved as unknown as ResponseSupplier;
  }

  async getById(id: string): Promise<ResponseSupplier> {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier as unknown as ResponseSupplier;
  }

  async list(): Promise<ResponseSupplier[]> {
    const suppliers = await this.supplierRepository.find();
    return suppliers as unknown as ResponseSupplier[];
  }
}


