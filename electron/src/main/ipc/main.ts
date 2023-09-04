import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ElectronIpcTransport } from './ipc-microservices/ipc.transport';

export async function bootstrapNestApp() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new ElectronIpcTransport(),
    }
  );
  await app.listen();
}
