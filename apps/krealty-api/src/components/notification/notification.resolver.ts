import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import {
  NotificationInput,
  NotificationsInquiry,
} from '../../libs/dto/notification/notification.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { NotificationService } from './notification.service';

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  /**======================================CREATE NOTIFICATION API============================================== */
  @UseGuards(AuthGuard)
  @Mutation(() => Notification)
  public async createNotification(
    @Args('input') input: NotificationInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notification> {
    console.log('Mutation: createNotification');
    return await this.notificationService.createNotification(memberId, input);
  }

  /**======================================GET NOTIFICATIONS API============================================== */
  @UseGuards(AuthGuard)
  @Query(() => Notifications)
  public async getNotifications(
    @Args('input') input: NotificationsInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notifications> {
    console.log('Query: getNotifications');
    return await this.notificationService.getNotifications(memberId, input);
  }

  /**======================================GET UNREAD NOTIFICATIONS COUNT API============================================== */
  @UseGuards(AuthGuard)
  @Query(() => Int)
  public async getUnreadNotificationsCount(@AuthMember('_id') memberId: ObjectId): Promise<number> {
    console.log('Query: getUnreadNotificationsCount');
    const result = await this.notificationService.getUnreadNotificationsCount(memberId);
    return result.count;
  }

  /**======================================MARK NOTIFICATION AS READ API============================================== */
  @UseGuards(AuthGuard)
  @Mutation(() => Notification)
  public async markNotificationAsRead(
    @Args('notificationId') notificationId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notification> {
    console.log('Mutation: markNotificationAsRead');
    const id = shapeIntoMongoObjectId(notificationId);
    return await this.notificationService.markNotificationAsRead(memberId, id);
  }

  /**======================================MARK ALL NOTIFICATIONS AS READ API============================================== */
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async markAllNotificationsAsRead(@AuthMember('_id') memberId: ObjectId): Promise<boolean> {
    console.log('Mutation: markAllNotificationsAsRead');
    return await this.notificationService.markAllNotificationsAsRead(memberId);
  }

  /**======================================DELETE NOTIFICATION API============================================== */
  @UseGuards(AuthGuard)
  @Mutation(() => Notification)
  public async deleteNotification(
    @Args('notificationId') notificationId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notification> {
    console.log('Mutation: deleteNotification');
    const id = shapeIntoMongoObjectId(notificationId);
    return await this.notificationService.deleteNotification(memberId, id);
  }
}
