import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { MemberStatus } from '../../krealty-api/src/libs/enums/member.enum';
import { NotificationStatus } from '../../krealty-api/src/libs/enums/notification.enum';

@Injectable()
export class KrealtyBatchService {
  constructor(
    @InjectModel('Notification') private readonly notificationModel: Model<any>,
    @InjectModel('Member') private readonly memberModel: Model<any>,
  ) {}

  getHello(): string {
    return 'Welcome to KRealty Batch!';
  }

  public async batchRollback(): Promise<void> {
    console.log('batchRollback executed');
  }

  public async batchProperties(): Promise<void> {
    console.log('batchProperties executed');
  }

  public async batchTopAgents(): Promise<void> {
    console.log('batchTopAgents executed');
  }

  /**======================================BATCH UNREAD NOTIFICATIONS COUNT API============================================== */
  @Cron('0 0 * * *') // Har 24 soatda bir marta (har kuni 00:00 da)
  public async batchUnreadNotificationsCount(): Promise<void> {
    console.log(
      'Query: getUnreadNotificationsCount - Batch job started at',
      new Date().toISOString(),
    );

    try {
      // Barcha aktiv memberlarni olish
      const activeMembers = await this.memberModel
        .find({
          memberStatus: MemberStatus.ACTIVE,
          deletedAt: { $exists: false },
        })
        .select('_id')
        .lean()
        .exec();

      console.log(`Found ${activeMembers.length} active members`);

      let totalUnreadCount = 0;
      let processedCount = 0;

      // Har bir member uchun unread notifications count-ni hisoblash
      for (const member of activeMembers) {
        const count = await this.notificationModel
          .countDocuments({
            receiverId: member._id,
            notificationStatus: NotificationStatus.WAIT,
          })
          .exec();

        totalUnreadCount += count;
        processedCount++;

        // Har 100 member uchun progress log
        if (processedCount % 100 === 0) {
          console.log(`Processed ${processedCount}/${activeMembers.length} members`);
        }
      }

      console.log(
        `Query: getUnreadNotificationsCount - Batch job completed. ` +
          `Total unread notifications: ${totalUnreadCount} across ${processedCount} members`,
      );
    } catch (error) {
      console.error('Error in batchUnreadNotificationsCount:', error.message);
      throw error;
    }
  }
}
