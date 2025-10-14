import { Injectable } from '@nestjs/common';

@Injectable()
export class KrealtyBatchService {
  getHello(): string {
    return 'Welcome to KRealty Batch!';
  }
}
