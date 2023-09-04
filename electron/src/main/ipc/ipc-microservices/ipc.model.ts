export interface IpcChannel {
  target: object;
  propertyKey: string | symbol;
  channel: string;
  opts?: IpcChannelOptions;
}

export interface IpcChannelOptions {
  logs: true;
}
