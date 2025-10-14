import { Test, TestingModule } from '@nestjs/testing';
import { KrealtyBatchController } from './krealty-batch.controller';
import { KrealtyBatchService } from './krealty-batch.service';

describe('KrealtyBatchController', () => {
  let krealtyBatchController: KrealtyBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [KrealtyBatchController],
      providers: [KrealtyBatchService],
    }).compile();

    krealtyBatchController = app.get<KrealtyBatchController>(KrealtyBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(krealtyBatchController.getHello()).toBe('Hello World!');
    });
  });
});
