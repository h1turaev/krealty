import { Controller, Get, Logger } from '@nestjs/common';
import { KrealtyBatchService } from './krealty-batch.service';
import { Cron } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_PROPERTIES, BATCH_TOP_AGENTS } from '../lib/config';

@Controller()
export class KrealtyBatchController {
  private logger: Logger = new Logger('KrealtyBatchController');

  constructor(private readonly krealtyBatchService: KrealtyBatchService) {}

  @Get()
  getHello(): string {
    return this.krealtyBatchService.getHello();
  }

  @Cron('*/10 * * * * *', { name: BATCH_ROLLBACK })
  public async batchRollback() {
    try {
      this.logger['context'] = BATCH_ROLLBACK;
      this.logger.debug('EXECUTED!');
      await this.krealtyBatchService.batchRollback();
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Cron('*/10 * * * * *', { name: BATCH_TOP_PROPERTIES })
  public async batchProperties() {
    try {
      this.logger['context'] = BATCH_TOP_PROPERTIES;
      this.logger.debug('EXECUTED!');
      await this.krealtyBatchService.batchProperties();
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Cron('*/10 * * * * *', { name: BATCH_TOP_AGENTS })
  public async batchAgents() {
    try {
      this.logger['context'] = BATCH_TOP_AGENTS;
      this.logger.debug('EXECUTED!');
      await this.krealtyBatchService.batchTopAgents();
    } catch (err) {
      this.logger.error(err);
    }
  }
}
