import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ObjectId } from 'bson';

export const AuthMember = createParamDecorator((data: string, context: ExecutionContext | any) => {
  let request: any;
  if (context.contextType === 'graphql') {
    request = context.getArgByIndex(2).req;
    if (request.body.authMember) {
      request.body.authMember.authorization = request.headers?.authorization;
    }
  } else request = context.switchToHttp().getRequest();

  const member = request.body.authMember;

  if (!member) return null;

  const value = data ? member?.[data] : member;

  if (data === '_id' && typeof value === 'string') {
    return new ObjectId(value);
  }

  return value;
});
