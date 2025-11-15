import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  lookupAuthMemberFollowed,
  lookupAuthMemberLiked,
  lookupFollowerData,
  lookupFollowingData,
} from '../../libs/config';
import { Follower, Followers, Following, Followings } from '../../libs/dto/follow/follow';
import { FollowInquiry } from '../../libs/dto/follow/follow.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { MemberService } from '../member/member.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel('Follow') private readonly followModel: Model<Follower | Following>,
    private readonly memberService: MemberService,
  ) {}

  // ============================== SUBSCRIBE API ==============================//
  public async subscribe(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
    if (followerId.toString() === followingId.toString()) {
      throw new InternalServerErrorException(Message.SELF_SUBSCRIPTION_DENIED);
    }

    const targetMember = await this.memberService.getMember(null, followingId);
    if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    const result = await this.registerSubscription(followerId, followingId);

    await this.memberService.memberStatsEditor({
      _id: followerId,
      targetKey: 'memberFollowings',
      modifier: 1,
    });

    await this.memberService.memberStatsEditor({
      _id: followingId,
      targetKey: 'memberFollowers',
      modifier: 1,
    });

    return result;
  }

  // ============================== UNSUBSCRIBE API ==============================//
  public async unsubscribe(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
    const targetMember = await this.memberService.getMember(null, followingId);
    if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    const result = await this.followModel
      .findOneAndDelete({
        followingId: followingId,
        followerId: followerId,
      })
      .exec();

    if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    await this.memberService.memberStatsEditor({
      _id: followerId,
      targetKey: 'memberFollowings',
      modifier: -1,
    });

    await this.memberService.memberStatsEditor({
      _id: followingId,
      targetKey: 'memberFollowers',
      modifier: -1,
    });

    return result;
  }

  // ============================== REGISTER SUBSCRIPTION API ==============================//
  private async registerSubscription(
    followerId: ObjectId,
    followingId: ObjectId,
  ): Promise<Follower> {
    try {
      return await this.followModel.create({
        followingId: followingId,
        followerId: followerId,
      });
    } catch (err) {
      console.log('Error, Service.model:', err.message);
      throw new BadRequestException(Message.CREATE_FAILED);
    }
  }

  // ============================== GET MEMBER FOLLOWINGS API ==============================//
  public async getMemberFollowings(memberId: ObjectId, input: FollowInquiry): Promise<Followings> {
    const { page, limit, search } = input;
    if (!search?.followerId) throw new InternalServerErrorException(Message.BAD_REQUEST);

    const match: T = { followerId: search.followerId };
    console.log('match:', match);

    const result = await this.followModel
      .aggregate([
        { $match: match },
        { $sort: { createdAt: Direction.DESC } },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              lookupAuthMemberLiked(memberId, '$followingId'),
              lookupAuthMemberFollowed({ followerId: memberId, followingId: '$followingId' }),
              // meLiked
              // meFollowed
              lookupFollowingData,
              { $unwind: '$followingData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result[0];
  }

  // ============================== GET MEMBER FOLLOWERS API ==============================//
  public async getMemberFollowers(memberId: ObjectId, input: FollowInquiry): Promise<Followers> {
    const { page, limit, search } = input;
    if (!search?.followingId) throw new InternalServerErrorException(Message.BAD_REQUEST);

    const match: T = { followingId: search.followingId };
    console.log('match:', match);

    const result = await this.followModel
      .aggregate([
        { $match: match },
        { $sort: { createdAt: Direction.DESC } },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              lookupAuthMemberLiked(memberId, '$followerId'),
              lookupAuthMemberFollowed({ followerId: memberId, followingId: '$followerId' }),
              // meLiked
              // meFollowed
              lookupFollowerData,
              { $unwind: '$followerData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result[0];
  }

  // ============================== GET FOLLOWER IDS API ==============================//
  public async getFollowerIds(followingId: ObjectId): Promise<ObjectId[]> {
    const followers = await this.followModel
      .find({ followingId: followingId })
      .select('followerId')
      .lean()
      .exec();

    return followers.map((f) => f.followerId);
  }
}
