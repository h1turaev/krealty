import { Module } from '@nestjs/common';
import { KrealtyBatchController } from './krealty-batch.controller';
import { KrealtyBatchService } from './krealty-batch.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot(), DatabaseModule],
  controllers: [KrealtyBatchController],
  providers: [KrealtyBatchService],
})
export class KrealtyBatchModule {}
