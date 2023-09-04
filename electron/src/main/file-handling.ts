import { BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import { readdirSync, statSync } from 'fs-extra';
import { Config } from './config';
import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';

const folderPath = path.join(__dirname, '../file-upload');

export function initFileHandling() {
  ipcMain.on('upload-files', (event, args) => {
    const folderName = folderPath + '/' + args.folderName;
    const validationRule: FileValidationRule = args.validationRule;
    const files = dialog.showOpenDialogSync(
      Config.mainWindow as BrowserWindow,
      {
        title: 'Select files',
        defaultPath: folderName,
        filters: [{ name: 'JSON', extensions: validationRule.fileExtensions }],
      }
    );
    if (files) {
      for (let item of files) {
        if (statSync(item).size > validationRule.maxSize) {
          console.log('File size is big');
          showErrorDialog({
            title: 'Size error',
            body:
              'File size is big. It should be less than ' +
              validationRule.maxSize +
              ' bytes',
          });
          event.returnValue = { error: 'File size is big' };
          return;
        }
        if (validationRule.fileExtensions.length > 0) {
          const extension = item.split('.').filter(Boolean).slice(1).join('.');
          if (!validationRule.fileExtensions.find((ext) => ext === extension)) {
            console.log('File exetension not allowed');

            showErrorDialog({
              title: 'File exetension error',
              body:
                'File exetension not allowed. Allowed exentions are ' +
                validationRule.fileExtensions.toString(),
            });
            event.returnValue = { error: 'File exetension not allowed' };
            return;
          }
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

export interface FileValidationRule {
  maxSize: number;
  fileExtensions: string[];
}
