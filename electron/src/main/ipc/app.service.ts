import { Injectable } from '@nestjs/common';
import { app } from 'electron';
import { writeFileSync } from 'fs';
import * as path from 'path';
import { startWatching, stopWatching } from '../myfile-watcher';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World Demo!';
  }

  saveFile(fileContent: string): void {
    let filePath = app.getPath('appData') + 'app.txt';
    writeFileSync(filePath, fileContent);
  }

  startWatchingFs(): void {
    startWatching();
  }

  stopWatchingFs(): void {
    stopWatching();
  }
}
