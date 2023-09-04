import { applyDecorators } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { configuredChannels } from './ipc.data';
import { IpcChannelOptions } from './ipc.model';

export function ElectronIpcOn(channel: string, opts?: IpcChannelOptions) {
  validateChannel(channel);
  return applyDecorators(ipcDecorator(channel, opts), EventPattern(channel));
}

export function ElectronIpcHandle(channel: string, opts?: IpcChannelOptions) {
  validateChannel(channel);
  return applyDecorators(ipcDecorator(channel, opts), MessagePattern(channel));
}

const ipcDecorator = (
  channel: string,
  opts?: IpcChannelOptions
): MethodDecorator => {
  return (
    target: any,
    propertyKey: string | symbol,
    _descriptor: PropertyDescriptor
  ) => {
    configuredChannels.set(channel, { target, propertyKey, channel, opts });
  };
};

function validateChannel(channel: string) {
  if (configuredChannels.has(channel)) {
    throw new Error(
      'Duplicate channel configured in one of the IPC controller : ' + channel
    );
  }
}
