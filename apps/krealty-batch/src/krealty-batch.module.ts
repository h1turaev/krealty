import { Module } from '@nestjs/common';
import { KrealtyBatchController } from './krealty-batch.controller';
import { KrealtyBatchService } from './krealty-batch.service';

@Module({
  imports: [],
  controllers: [KrealtyBatchController],
  providers: [KrealtyBatchService],
})
export class KrealtyBatchModule {}
