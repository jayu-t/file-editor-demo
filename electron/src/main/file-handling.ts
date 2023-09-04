import {
  BrowserWindow,
  OpenDialogSyncOptions,
  dialog,
  ipcMain,
} from 'electron';
import * as path from 'path';
import { readdirSync, statSync } from 'fs-extra';
import { Config } from './config';
import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';
import { FileValidator, ValidationRule } from './file-validator';

const folderPath = path.join(__dirname, '../file-upload');

export function initFileHandling() {
  ipcMain.on('upload-files', (event, args) => {
    const folderName = folderPath + '/' + args.folderName;
    const validationRule: ValidationRule = args.validationRule;
    let fileOptions: OpenDialogSyncOptions = {
      title: 'Select files',
      defaultPath: folderName,
      filters: [],
    };
    if (validationRule.allowExtentions) {
      fileOptions.filters = [
        { name: 'JSON', extensions: validationRule.allowExtentions },
      ];
    }
    const files = dialog.showOpenDialogSync(
      Config.mainWindow as BrowserWindow,
      fileOptions
    );
    if (files) {
      for (let item of files) {
        let validatorMessage = FileValidator.validateFile(item, validationRule);
        if (!validatorMessage.valid) {
          showErrorDialog({
            title: validatorMessage.error?.shortDesc as string,
            body: validatorMessage.error?.descreption as string,
          });
          event.returnValue = { error: validatorMessage.error?.descreption };
          return;
        }
      }
    }
    console.log(files);
    event.returnValue = files;
  });

  ipcMain.on('get-files', (event, folderName) => {
    folderName = folderPath + '/' + folderName;
    console.log(folderName);
    const files = readdirSync(folderName);
    let filesArr: FileItem[] = [];
    files.forEach((file) => {
      filesArr.push({
        name: file,
        size: statSync(folderName + '/' + file).size,
        extension: file.split('.').filter(Boolean).slice(1).join('.'),
      });
    });
    console.log(filesArr);
    event.returnValue = filesArr;
  });

  ipcMain.on('get-folders', (event, args) => {
    const files = readdirSync(folderPath);
    let filesArr: string[] = [];
    files.forEach((file) => {
      filesArr.push(file);
    });
    console.log('folders', filesArr);
    event.returnValue = filesArr;
  });

  const watcher = chokidar.watch(folderPath);

  watcher.on('add', (path: string) => {
    console.log(`File ${path} has been added`);
  });
}

function showErrorDialog(message: ErrorMessage) {
  dialog.showErrorBox(message.title, message.body);
}

export interface ErrorMessage {
  title: string;
  body: string;
}

export interface FileItem {
  name: string;
  size: number;
  extension: string;
}
