import { Module } from '@nestjs/common';
import { KrealtyBatchController } from './krealty-batch.controller';
import { KrealtyBatchService } from './krealty-batch.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import NotificationSchema from '../../krealty-api/src/schemas/Notification.model';
import MemberSchema from '../../krealty-api/src/schemas/Member.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: 'Notification',
        schema: NotificationSchema,
      },
      {
        name: 'Member',
        schema: MemberSchema,
      },
    ]),
  ],
  controllers: [KrealtyBatchController],
  providers: [KrealtyBatchService],
})
export class KrealtyBatchModule {}
