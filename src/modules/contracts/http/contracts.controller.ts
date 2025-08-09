import { Body, Controller, Get, Inject, Param, Patch, Post, Req } from '@nestjs/common';
import { ContractsService } from '../domain/contracts.service';
import type { RequestCreateContract, RequestUpdateContract, ResponseContract } from './interfaces';
import { Logger } from 'winston';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/validators/decorators';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('Contracts')
@UseGuards(JwtGuard)
@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,

    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @Post()
  @Roles('planner')
  create(@Body() body: RequestCreateContract): Promise<ResponseContract> {
    return this.contractsService.create(body);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Req() req: any): Promise<ResponseContract> {
    // futuramente: se role=client, verificar se pertence ao evento; se role=supplier, verificar ownerUser
    return this.contractsService.getById(id);
  }

  @Patch(':id')
  @Roles('planner')
  update(
    @Param('id') id: string,
    @Body() body: RequestUpdateContract,
  ): Promise<ResponseContract> {
    return this.contractsService.update(id, body);
  }
}


