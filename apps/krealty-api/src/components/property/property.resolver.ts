import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId, getSerialForImage } from '../../libs/config';
import { Property } from '../../libs/dto/property/property';
import { PropertyInput } from '../../libs/dto/property/property.input';
import { PropertyUpdate } from '../../libs/dto/property/property.update';

@Resolver()
export class PropertyResolver {
  constructor(private readonly propertyService: PropertyService) {}

  //===================================== CREATE PROPERTY =====================================//
  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Mutation(() => Property)
  public async createProperty(
    @Args('input') input: PropertyInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Property> {
    console.log('Mutation: createProperty');
    input.memberId = memberId;
    return await this.propertyService.createProperty(input);
  }

  //===================================== GET PROPERTY =====================================//
  @UseGuards(WithoutGuard)
  @Query(() => Property)
  public async getProperty(
    @Args('propertyId') input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Property> {
    console.log('Query: getProperty');
    const propertyId = shapeIntoMongoObjectId(input);
    return await this.propertyService.getProperty(memberId, propertyId);
  }

  //===================================== UPDATE PROPERTY =====================================//
  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Mutation(() => Property)
  public async updateProperty(
    @Args('input') input: PropertyUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Property> {
    console.log('Mutation: updateProperty');
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.propertyService.updateProperty(memberId, input);
  }
}
