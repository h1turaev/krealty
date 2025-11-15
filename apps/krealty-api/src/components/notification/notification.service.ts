import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  Notification,
  Notifications,
  UnreadNotificationsCount,
} from '../../libs/dto/notification/notification';
import {
  NotificationInput,
  NotificationsInquiry,
} from '../../libs/dto/notification/notification.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { NotificationStatus } from '../../libs/enums/notification.enum';
import { T } from '../../libs/types/common';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
  ) {}

  /**======================================CREATE NOTIFICATION API============================================== */
  public async createNotification(
    authorId: ObjectId,
    input: NotificationInput,
  ): Promise<Notification> {
    try {
      const notificationData = {
        ...input,
        authorId: authorId,
        notificationStatus: NotificationStatus.WAIT,
      };
      const result = await this.notificationModel.create(notificationData);
      return result;
    } catch (err) {
      console.error('Error creating notification:', err.message);
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }
  }

  /**======================================GET NOTIFICATIONS API============================================== */
  public async getNotifications(
    memberId: ObjectId,
    input: NotificationsInquiry,
  ): Promise<Notifications> {
    const { notificationStatus, notificationType, notificationGroup } = input.search;
    const match: T = { receiverId: memberId };
    const sort: T = { createdAt: Direction.DESC };

    if (notificationStatus) match.notificationStatus = notificationStatus;
    if (notificationType) match.notificationType = notificationType;
    if (notificationGroup) match.notificationGroup = notificationGroup;

    const pipeline: any[] = [
      { $match: match },
      { $sort: sort },
      {
        $facet: {
          list: [
            { $skip: (input.page - 1) * input.limit },
            { $limit: input.limit },
            {
              $lookup: {
                from: 'members',
                localField: 'authorId',
                foreignField: '_id',
                as: 'authorData',
              },
            },
            { $unwind: { path: '$authorData', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'properties',
                localField: 'propertyId',
                foreignField: '_id',
                as: 'propertyData',
              },
            },
            { $unwind: { path: '$propertyData', preserveNullAndEmptyArrays: true } },
          ],
          metaCounter: [{ $count: 'total' }],
        },
      },
    ];

    const result = await this.notificationModel.aggregate(pipeline).exec();

    if (!result.length) {
      return {
        list: [],
        metaCounter: [{ total: 0 }],
      };
    }

    return result[0];
  }

  /**======================================GET UNREAD NOTIFICATIONS COUNT API============================================== */
  public async getUnreadNotificationsCount(memberId: ObjectId): Promise<UnreadNotificationsCount> {
    const count = await this.notificationModel
      .countDocuments({
        receiverId: memberId,
        notificationStatus: NotificationStatus.WAIT,
      })
      .exec();

    return { count };
  }

  /**======================================MARK NOTIFICATION AS READ API============================================== */
  public async markNotificationAsRead(
    memberId: ObjectId,
    notificationId: ObjectId,
  ): Promise<Notification> {
    const result = await this.notificationModel
      .findOneAndUpdate(
        {
          _id: notificationId,
          receiverId: memberId,
        },
        { notificationStatus: NotificationStatus.READ },
        { new: true },
      )
      .exec();

    if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result;
  }

  /**======================================MARK ALL NOTIFICATIONS AS READ API============================================== */
  public async markAllNotificationsAsRead(memberId: ObjectId): Promise<boolean> {
    const result = await this.notificationModel
      .updateMany(
        {
          receiverId: memberId,
          notificationStatus: NotificationStatus.WAIT,
        },
        { notificationStatus: NotificationStatus.READ },
      )
      .exec();

    return result.modifiedCount > 0;
  }

  /**======================================DELETE NOTIFICATION API============================================== */
  public async deleteNotification(
    memberId: ObjectId,
    notificationId: ObjectId,
  ): Promise<Notification> {
    const result = await this.notificationModel
      .findOneAndDelete({
        _id: notificationId,
        receiverId: memberId,
      })
      .exec();

    if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result;
  }

  /**======================================CREATE NOTIFICATIONS FOR FOLLOWERS API============================================== */
  public async createNotificationsForFollowers(
    authorId: ObjectId,
    followers: ObjectId[],
    notificationData: Omit<NotificationInput, 'receiverId'>,
  ): Promise<void> {
    if (!followers || followers.length === 0) return;

    const notifications = followers.map((followerId) => ({
      ...notificationData,
      authorId: authorId,
      receiverId: followerId,
      notificationStatus: NotificationStatus.WAIT,
    }));

    try {
      await this.notificationModel.insertMany(notifications);
    } catch (err) {
      console.error('Error creating notifications for followers:', err.message);
      // Don't throw error, just log it - we don't want to fail the main operation
    }
  }
}
