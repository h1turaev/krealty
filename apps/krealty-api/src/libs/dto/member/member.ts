import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
//DTO — Data Transfer Object: tashqi dunyo (client ↔ server) bilan ma’lumot

@ObjectType()
export class Member {
  @Field(() => String) // graphql uchun
  _id: ObjectId; // mongodb uchun

  @Field(() => MemberType)
  memberType: MemberType; // USER, ADMIN, AGENT

  @Field(() => MemberStatus)
  memberStatus: MemberStatus; // ACTIVE, INACTIVE, BLOCKED

  @Field(() => MemberAuthType)
  memberAuthType: MemberAuthType; // PHONE, EMAIL, TELEGRAM

  @Field(() => String)
  memberPhone: string; // unique

  @Field(() => String)
  memberNick: string; // unique

  memberPassword?: string; // hashed faqat typescript uchun

  @Field(() => String, { nullable: true })
  memberFullName?: string; // nullable optional

  @Field(() => String) // graphql uchun
  memberImage: string; // nullable optional

  @Field(() => String, { nullable: true }) // graphql uchun
  memberAddress?: string; // nullable optional

  @Field(() => String, { nullable: true }) // graphql uchun
  memberDesc?: string; // nullable optional

  @Field(() => Int) // graphql uchun
  memberProperties: number; // default 0

  @Field(() => Int) // graphql uchun
  memberArticles: number; // default 0

  @Field(() => Int) // graphql uchun
  memberFollowers: number; // default 0

  @Field(() => Int) // graphql uchun
  memberFollowings: number; // default 0

  @Field(() => Int) // graphql uchun
  memberPoints: number; // default 0

  @Field(() => Int) // graphql uchun
  memberLikes: number; // default 0

  @Field(() => Int) // graphql uchun
  memberViews: number; // default 0

  @Field(() => Int) // graphql uchun
  memberComments: number; // default 0

  @Field(() => Int) // graphql uchun
  memberRank: number; // default 0

  @Field(() => Int) // graphql uchun
  memberWarnings: number; // default 0

  @Field(() => Int) // graphql uchun
  memberBlocks: number; // default 0

  @Field(() => Date, { nullable: true }) // graphql uchun
  deletedAt?: Date; // nullable optional

  @Field(() => Date) // graphql uchun
  createdAt?: Date; // nullable optional

  @Field(() => Date) // graphql uchun
  updatedAt?: Date; // nullable optional

  @Field(() => String, { nullable: true })
  accessToken?: string; // nullable optional
}

@ObjectType()
export class TotalCounter {
  @Field(() => Int, { nullable: true })
  total: number;
}

@ObjectType()
export class Members {
  @Field(() => [Member])
  list: Member[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[]; //
}
