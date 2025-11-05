import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  /**======================================SIGNUP API============================================== */
  @Mutation(() => Member)
  public async signup(@Args('input') input: MemberInput): Promise<Member> {
    try {
      console.log('mutation:signup');
      return this.memberService.signup(input);
    } catch (err) {
      console.error('Error during signup:', err);
      throw new InternalServerErrorException(err);
    }
  }

  /**======================================LOGIN API============================================== */
  @Mutation(() => Member)
  public async login(@Args('input') input: LoginInput): Promise<Member> {
    try {
      console.log('mutation: login');
      return this.memberService.login(input);
    } catch (err) {
      console.error('Error during login:', err);
      throw new InternalServerErrorException(err);
    }
  }

  /**======================================UPDATE MEMBER API============================================== */
  @UseGuards(AuthGuard)
  @Mutation(() => Member)
  public async updateMember(
    @Args('input') input: MemberUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Member> {
    console.log('Mutation: updateMember');
    delete input._id;
    return this.memberService.updateMember(memberId, input);
  }

  /**======================================CHECK AUTH API============================================== */
  @UseGuards(AuthGuard)
  @Query(() => String)
  public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
    console.log('query: checkAuth');
    console.log('memberNick:', memberNick);
    return `Hi ${memberNick}, you are authenticated!`;
  }

  /**======================================CHECK AUTH ROLES API============================================== */
  @Roles(MemberType.USER, MemberType.AGENT)
  @UseGuards(RolesGuard) // bu yerda AuthGuard ni ishlatamiz
  @Query(() => String)
  public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
    console.log('query: checkAuthRoles');
    console.log('memberNick:', authMember.memberNick);
    return `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})!`;
  }

  /**======================================GET MEMBER API============================================== */
  @Query(() => Member)
  public async getMember(@Args('memberId') input: string): Promise<Member> {
    console.log('getMember: query');
    const targetId = shapeIntoMongoObjectId(input); 
    return this.memberService.getMember(targetId);
  }

  /**======================================GET ALL MEMBERS BY ADMIN API============================================== */
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => String)
  public async getAllMembersByAdmin(): Promise<string> {
    return this.memberService.getAllMembersByAdmin();
  }

  /**======================================UPDATE MEMBER BY ADMIN API============================================== */
  @Mutation(() => String)
  public async updateMemberByAdmin(): Promise<string> {
    console.log('Mutation: updateMemberByAdmin');
    return this.memberService.updateMemberByAdmin();
  }
}
