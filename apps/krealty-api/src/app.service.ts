import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  async SayHello(): Promise<string> {
  return 'GraphQL API is running!';
}
}
