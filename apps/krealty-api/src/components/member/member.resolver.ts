import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';

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

  @Mutation(() => String)
  public async updateMember(): Promise<string> {
    console.log('mutation: updateMember');
    return this.memberService.updateMember();
  }

  @Query(() => String)
  public async getMember(): Promise<string> {
    console.log('getMember: query');
    return this.memberService.getMember();
  }
}
