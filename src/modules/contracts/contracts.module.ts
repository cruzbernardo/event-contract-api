import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract, EventSupplier } from 'src/database/entities';
import { ContractsService } from './domain/contracts.service';
import { ContractsController } from './http/contracts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, EventSupplier])],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
