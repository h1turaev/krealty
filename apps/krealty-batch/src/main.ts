import { NestFactory } from '@nestjs/core';
import { KrealtyBatchModule } from './krealty-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(KrealtyBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
