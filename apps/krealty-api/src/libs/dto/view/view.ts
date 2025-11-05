import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { ViewGroup } from '../../enums/view.enum';

//DTO — Data Transfer Object: tashqi dunyo (client ↔ server) bilan ma’lumot
// almashish uchun aniq tiplangan “kontrakt”. U faqat ma’lumot tuzilmasini 
// ifodalaydi (logika yo‘q). NestJS’da DTO’lar orqali validation, transform, 
// va API ni xavfsiz ajratish qilinadi.

//MemberInput - foydalanuvchi ro'yxatdan o'tish uchun kerak bo'lgan ma'lumotlar
@ObjectType()
export class View {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => ViewGroup)
  viewGroup: ViewGroup;

  @Field(() => String)
  viewRefId: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
