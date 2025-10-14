import { Module } from '@nestjs/common';
import { KrealtyBatchController } from './krealty-batch.controller';
import { KrealtyBatchService } from './krealty-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [KrealtyBatchController],
  providers: [KrealtyBatchService],
})
export class KrealtyBatchModule {}
