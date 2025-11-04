import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

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

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  public async updateMember(@AuthMember('_id') memberId: ObjectId): Promise<string> {
    console.log('mutation: updateMember');
    return this.memberService.updateMember();
  }

  @UseGuards(AuthGuard)
  @Query(() => String)
  public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
    console.log('query: checkAuth');
    console.log('memberNick:', memberNick);
    return `Hi ${memberNick}, you are authenticated!`;
  }

  @Query(() => String)
  public async getMember(): Promise<string> {
    console.log('getMember: query');
    return this.memberService.getMember();
  }

  @Mutation(() => String)
  public async getAllMembersByAdmin(): Promise<string> {
    return this.memberService.getAllMembersByAdmin();
  }

  @Mutation(() => String)
  public async updateMemberByAdmin(): Promise<string> {
    console.log('Mutation: updateMemberByAdmin');
    return this.memberService.updateMemberByAdmin();
  }
}
