import { NestFactory } from '@nestjs/core';
import { KrealtyBatchModule } from './krealty-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(KrealtyBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
