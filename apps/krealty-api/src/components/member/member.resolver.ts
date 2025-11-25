import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { createWriteStream } from 'fs';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ObjectId } from 'mongoose';
import { getSerialForImage, shapeIntoMongoObjectId, validMimeTypes } from '../../libs/config';
import { Member, Members } from '../../libs/dto/member/member';
import {
  AgentsInquiry,
  LoginInput,
  MemberInput,
  MembersInquiry,
} from '../../libs/dto/member/member.input';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { Message } from '../../libs/enums/common.enum';
import { MemberType } from '../../libs/enums/member.enum';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { WithoutGuard } from '../auth/guards/without.guard';
import { MemberService } from './member.service';

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
      throw await new InternalServerErrorException(err);
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
      throw await new InternalServerErrorException(err);
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
    return await this.memberService.updateMember(memberId, input);
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
  @UseGuards(WithoutGuard)
  @Query(() => Member)
  public async getMember(
    @Args('memberId') input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Member> {
    console.log('getMember: query');
    const targetId = shapeIntoMongoObjectId(input); // string ni ObjectId ga aylantiramiz
    return await this.memberService.getMember(memberId, targetId); // memberId ni service ga uzatamiz
  }

  /**======================================GET AGENTS API============================================== */
  @UseGuards(WithoutGuard)
  @Query(() => Members)
  public async getAgents(
    @Args('input') input: AgentsInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Members> {
    console.log('getAgents: query');
    return await this.memberService.getAgents(memberId, input);
  }

  /**======================================GET ADMIN API============================================== */
  @UseGuards(WithoutGuard)
  @Query(() => Member)
  public async getAdmin(): Promise<Member> {
    console.log('Query: getAdmin');
    return await this.memberService.getAdmin();
  }

  /**======================================GET ALL MEMBERS BY ADMIN API============================================== */
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Members)
  public async getAllMembersByAdmin(@Args('input') input: MembersInquiry): Promise<Members> {
    return await this.memberService.getAllMembersByAdmin(input);
  }

  /**======================================UPDATE MEMBER BY ADMIN API============================================== */
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Member)
  public async updateMemberByAdmin(@Args('input') input: MemberUpdate): Promise<Member> {
    console.log('Mutation: updateMemberByAdmin');
    return await this.memberService.updateMemberByAdmin(input);
  }

  // /**======================================LIKE TARGET MEMBER API============================================== */
  @UseGuards(AuthGuard)
  @Mutation(() => Member)
  public async likeTargetMember(
    @Args('memberId') input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Member> {
    console.log('Mutation: likeTargetMember');
    const likeRefId = shapeIntoMongoObjectId(input);
    return await this.memberService.likeTargetMember(memberId, likeRefId);
  }

  /**======================================IMAGE UPLOADER API============================================== */
  @UseGuards(AuthGuard)
  @Mutation((returns) => String)
  public async imageUploader(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename, mimetype }: FileUpload,
    @Args('target') target: string,
  ): Promise<string> {
    console.log('Mutation: imageUploader');

    if (!filename) throw new Error(Message.UPLOAD_FAILED);
    const validMime = validMimeTypes.includes(mimetype);
    if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

    const imageName = getSerialForImage(filename);
    const url = `uploads/${target}/${imageName}`;
    const stream = createReadStream();

    const result = await new Promise((resolve, reject) => {
      stream
        .pipe(createWriteStream(url))
        .on('finish', async () => resolve(true))
        .on('error', () => reject(false));
    });
    if (!result) throw new Error(Message.UPLOAD_FAILED);

    return url;
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => [String])
  public async imagesUploader(
    @Args('files', { type: () => [GraphQLUpload] })
    files: Promise<FileUpload>[],
    @Args('target') target: string,
  ): Promise<string[]> {
    console.log('Mutation: imagesUploader');

    const uploadedImages = [];
    const promisedList = files.map(
      async (img: Promise<FileUpload>, index: number): Promise<Promise<void>> => {
        try {
          const { filename, mimetype, encoding, createReadStream } = await img;

          const validMime = validMimeTypes.includes(mimetype);
          if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

          const imageName = getSerialForImage(filename);
          const url = `uploads/${target}/${imageName}`;
          const stream = createReadStream();

          const result = await new Promise((resolve, reject) => {
            stream
              .pipe(createWriteStream(url))
              .on('finish', () => resolve(true))
              .on('error', () => reject(false));
          });
          if (!result) throw new Error(Message.UPLOAD_FAILED);

          uploadedImages[index] = url;
        } catch (err) {
          console.log('Error, file missing!');
        }
      },
    );

    await Promise.all(promisedList);
    return uploadedImages;
  }
}
