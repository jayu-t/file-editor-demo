import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { bootstrapNestApp } from './ipc/main';
import { initFileHandling } from './file-handling';
import { Config } from './config';

let mainWindow: BrowserWindow;

bootstrapNestApp();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.bundle.js'),
    },
  });

  Config.mainWindow = mainWindow;

  mainWindow.loadFile(path.join(__dirname, 'file-editor/index.html'));
  mainWindow.maximize();
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

initFileHandling();
