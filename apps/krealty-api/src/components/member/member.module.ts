import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';

@Module({
  imports: [
    //schema chaqirish usuli
    MongooseModule.forFeature([
      {
        name: 'Member',
        schema: MemberSchema,
      },
    ]),
    AuthModule, // AuthService ni ishlatish uchun import qilamiz
    ViewModule, // ViewService ni ishlatish uchun import qilamiz
  ],
  providers: [MemberResolver, MemberService],
})
export class MemberModule {}
