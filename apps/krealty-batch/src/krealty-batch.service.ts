import { Injectable } from '@nestjs/common';

@Injectable()
export class KrealtyBatchService {
  getHello(): string {
    return 'Welcome to KRealty Batch!';
  }

  public async batchRollback(): Promise<void> {
    console.log('batchRollback executed');
  }

  public async batchProperties(): Promise<void> {
    console.log('batchProperties executed');
  }

  public async batchTopAgents(): Promise<void> {
    console.log('batchTopAgents executed');
  }
}
