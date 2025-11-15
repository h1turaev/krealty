import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import {
  NotificationGroup,
  NotificationStatus,
  NotificationType,
} from '../../enums/notification.enum';

@InputType()
export class NotificationInput {
  @IsNotEmpty()
  @Field(() => NotificationType)
  notificationType: NotificationType;

  @IsNotEmpty()
  @Field(() => NotificationGroup)
  notificationGroup: NotificationGroup;

  @IsNotEmpty()
  @Field(() => String)
  notificationTitle: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  notificationDesc?: string;

  @IsNotEmpty()
  @Field(() => String)
  receiverId: ObjectId;

  @IsOptional()
  @Field(() => String, { nullable: true })
  propertyId?: ObjectId;

  @IsOptional()
  @Field(() => String, { nullable: true })
  articleId?: ObjectId;
}

@InputType()
class NotificationSearch {
  @IsOptional()
  @Field(() => NotificationStatus, { nullable: true })
  notificationStatus?: NotificationStatus;

  @IsOptional()
  @Field(() => NotificationType, { nullable: true })
  notificationType?: NotificationType;

  @IsOptional()
  @Field(() => NotificationGroup, { nullable: true })
  notificationGroup?: NotificationGroup;
}

@InputType()
export class NotificationsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsNotEmpty()
  @Field(() => NotificationSearch)
  search: NotificationSearch;
}
