import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ElectronIpcHandle,
  ElectronIpcOn,
} from './ipc-microservices/ipc.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ElectronIpcOn('hello1')
  getHello1(payload: string): string {
    console.log(payload);
    return this.appService.getHello();
  }

  @ElectronIpcOn('hello2')
  getHello2(payload: { msg: string }): string {
    console.log(payload);
    return this.appService.getHello();
  }

  @ElectronIpcHandle('hello3')
  getHello3(payload: string): string {
    console.log(payload);
    return this.appService.getHello();
  }

  @ElectronIpcHandle('hello4')
  getHello4(payload: { msg: string }): string {
    console.log(payload);
    return this.appService.getHello();
  }

  @ElectronIpcOn('save-file')
  saveFile(fileContent: string): void {
    console.log(fileContent);
    this.appService.saveFile(fileContent);
  }

  @ElectronIpcOn('start-watching')
  startWatchingFs(): void {
    this.appService.startWatchingFs();
  }

  @ElectronIpcOn('stop-watching')
  stopWatchingFs(): void {
    this.appService.stopWatchingFs();
  }
}
