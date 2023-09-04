import { contextBridge, ipcRenderer } from 'electron';

console.log('from preload');

contextBridge.exposeInMainWorld('ipc', {
  uploadFiles: (args: any) => ipcRenderer.sendSync('upload-files', args),
  getFiles: (args: any) => ipcRenderer.sendSync('get-files', args),
  getFolders: (args: any) => ipcRenderer.sendSync('get-folders'),
});
