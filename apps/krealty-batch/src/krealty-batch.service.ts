import { Injectable } from '@nestjs/common';

@Injectable()
export class KrealtyBatchService {
  getHello(): string {
    return 'Hello World!';
  }
}
