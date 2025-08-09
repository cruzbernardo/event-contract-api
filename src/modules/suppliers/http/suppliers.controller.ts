import { Body, Controller, Get, Inject, Param, Post, Req } from '@nestjs/common';
import { SuppliersService } from '../domain/suppliers.service';
import type { RequestCreateSupplier, ResponseSupplier } from './interfaces';
import { Logger } from 'winston';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/validators/decorators';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(
    private readonly suppliersService: SuppliersService,

    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @Post()
  @Roles('planner')
  create(@Req() req: any, @Body() body: RequestCreateSupplier): Promise<ResponseSupplier> {
    return this.suppliersService.create(body, req);
  }

  @Get()
  list(): Promise<ResponseSupplier[]> {
    return this.suppliersService.list();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<ResponseSupplier> {
    return this.suppliersService.getById(id);
  }
}


