import type {
  CustomTransportStrategy,
  MessageHandler,
} from '@nestjs/microservices';
import { Server } from '@nestjs/microservices';
import { isObservable, lastValueFrom } from 'rxjs';
import { ipcMain } from 'electron';
import { configuredChannels } from './ipc.data';

export class ElectronIpcTransport
  extends Server
  implements CustomTransportStrategy
{
  constructor() {
    super();
  }

  listen(callback: () => void): any {
    console.log('listen');
    console.log(configuredChannels);

    configuredChannels.forEach(({ target, channel, opts }, channelId) => {
      const handler = this.getHandlers().get(channelId);
      if (!handler) {
        const errMsg = `No handler for message channel "${channel}"`;
        this.logger.error(errMsg);
        throw new Error(errMsg);
      }
      if (handler.isEventHandler)
        ipcMain.on(channel, this.applyHandler(handler, channel, opts));
      else ipcMain.handle(channel, this.applyHandler(handler, channel, opts));
    });

    callback();
  }

  private applyHandler(
    handler: MessageHandler,
    channel: string,
    opts: any = {}
  ) {
    return async (...args: any) => {
      try {
        const [ipcMainEventObject, ...payload] = args;

        const data =
          payload.length === 0
            ? undefined
            : payload.length === 1
            ? payload[0]
            : payload;
        const ctx: any = { ipcEvt: ipcMainEventObject };

        const res = await handler(data, ctx);
        return isObservable(res) ? await lastValueFrom(res) : res;
      } catch (error: any) {
        console.error(error);
        throw new Error(error.message ?? error);
      }
    };
  }

  close(): any {}
}
