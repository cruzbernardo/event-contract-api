import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, EventSupplier } from 'src/database/entities';
import { Logger } from 'winston';
import type { RequestCreateContract, RequestUpdateContract, ResponseContract } from '../http/interfaces';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,

    @InjectRepository(EventSupplier)
    private readonly eventSupplierRepository: Repository<EventSupplier>,

    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async create(data: RequestCreateContract): Promise<ResponseContract> {
    const eventSupplier = await this.eventSupplierRepository.findOne({
      where: { id: data.eventSupplierId },
    });
    if (!eventSupplier) {
      throw new NotFoundException('EventSupplier not found');
    }

    const contract = this.contractRepository.create({
      status: (data.status as any) ?? ('pending' as any),
      contractDocumentUrl: data.contractDocumentUrl,
      depositAmount: data.depositAmount,
      depositPaid: data.depositPaid ?? false,
      dueDate: data.dueDate,
      terms: data.terms,
      notes: data.notes,
      eventSupplier: { id: data.eventSupplierId } as EventSupplier,
      supplier: eventSupplier.supplier,
    });
    const saved = await this.contractRepository.save(contract);
    this.logger.info(`Contract created id=${saved.id}`, {
      context: ContractsService.name,
    });
    return saved as unknown as ResponseContract;
  }

  async getById(id: string): Promise<ResponseContract> {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: { eventSupplier: true, supplier: true } as any,
    });
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }
    return contract as unknown as ResponseContract;
  }

  async update(id: string, data: RequestUpdateContract): Promise<ResponseContract> {
    const existing = await this.contractRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Contract not found');
    }
    Object.assign(existing, data);
    const saved = await this.contractRepository.save(existing);
    return saved as unknown as ResponseContract;
  }
}


