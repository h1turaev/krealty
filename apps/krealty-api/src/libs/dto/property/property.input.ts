import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';


 //DTO — Data Transfer Object: tashqi dunyo (client ↔ server) bilan ma’lumot
 
@InputType()
export class PropertyInput {
  @IsNotEmpty()
  @Field(() => PropertyType)
  propertyType: PropertyType;

  @IsNotEmpty()
  @Field(() => PropertyLocation)
  propertyLocation: PropertyLocation;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  propertyAddress: string;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  propertyTitle: string;

  @IsNotEmpty()
  @Field(() => Number)
  propertyPrice: number;

  @IsNotEmpty()
  @Field(() => Number)
  propertySquare: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Field(() => Int)
  propertyBeds: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Field(() => Int)
  propertyRooms: number;

  @IsNotEmpty()
  @Field(() => [String])
  propertyImages: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  propertyDesc?: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  propertyBarter?: boolean;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  propertyRent?: boolean;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberId?: ObjectId;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  constructedAt?: Date;
}