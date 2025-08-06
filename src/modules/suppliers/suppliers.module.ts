import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract, Supplier } from 'src/database/entities';
import { ContractsModule } from '../contracts/contracts.module';

@Module({ imports: [TypeOrmModule.forFeature([Supplier,Contract])] })
export class SuppliersModule {}
