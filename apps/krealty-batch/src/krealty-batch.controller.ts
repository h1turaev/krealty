import { Controller, Get } from '@nestjs/common';
import { KrealtyBatchService } from './krealty-batch.service';

@Controller()
export class KrealtyBatchController {
  constructor(private readonly krealtyBatchService: KrealtyBatchService) {}

  @Get()
  getHello(): string {
    return this.krealtyBatchService.getHello();
  }
}
