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
import { Properties, Property } from '../../libs/dto/property/property';
import {
  AgentPropertiesInquiry,
  AllPropertiesInquiry,
  PropertiesInquiry,
  PropertyInput,
} from '../../libs/dto/property/property.input';
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

  //===================================== GET PROPERTIES =====================================//
  @UseGuards(WithoutGuard)
  @Query(() => Properties)
  public async getProperties(
    @Args('input') input: PropertiesInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Properties> {
    console.log('Query: getProperties');
    return await this.propertyService.getProperties(memberId, input);
  }

  //===================================== GET AGENT PROPERTIES =====================================//
  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Query(() => Properties)
  public async getAgentProperties(
    @Args('input') input: AgentPropertiesInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Properties> {
    console.log('Query: getAgentProperties');
    return await this.propertyService.getAgentProperties(memberId, input);
  }

  //=====================================GET ALL PROPERTIES BY ADMIN=====================================//
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Properties)
  public async getAllPropertiesByAdmin(
    @Args('input') input: AllPropertiesInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Properties> {
    console.log('Query: getAllPropertiesByAdmin');
    return await this.propertyService.getAllPropertiesByAdmin(input);
  }

  //======================================UPDATE PROPERTY BY ADMIN=====================================//
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Property)
  public async updatePropertyByAdmin(@Args('input') input: PropertyUpdate): Promise<Property> {
    console.log('Mutation: updatePropertyByAdmin');
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.propertyService.updatePropertyByAdmin(input);
  }

  //=====================================REMOVE PROPERTY BY ADMIN=====================================//
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Property)
  public async removePropertyByAdmin(@Args('propertyId') input: string): Promise<Property> {
    console.log('Mutation: removePropertyByAdmin');
    const propertyId = shapeIntoMongoObjectId(input);
    return await this.propertyService.removePropertyByAdmin(propertyId);
  }
}
