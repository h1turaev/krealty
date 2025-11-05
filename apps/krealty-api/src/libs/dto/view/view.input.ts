//DTO — Data Transfer Object: tashqi dunyo (client ↔ server) bilan ma’lumot
// almashish uchun aniq tiplangan “kontrakt”. U faqat ma’lumot tuzilmasini
// ifodalaydi (logika yo‘q). NestJS’da DTO’lar orqali validation, transform,
// va API ni xavfsiz ajratish qilinadi.

import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ViewGroup } from '../../enums/view.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class ViewInput {
  @IsNotEmpty()
  @Field(() => String)
  memberId: ObjectId;

  @IsNotEmpty()
  @Field(() => String)
  viewRefId: ObjectId;

  @IsNotEmpty()
  @Field(() => ViewGroup)
  viewGroup: ViewGroup;
}
