import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

const uploadFilesIpc = (window as any).ipc.uploadFiles;
const getFilesIpc = (window as any).ipc.getFiles;
const getFoldersIpc = (window as any).ipc.getFolders;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  displayedColumns: string[] = ['name', 'size', 'extension'];
  items: Item[] = [];
  dataSource: FileItem[] = [];
  selectedFolder = '';

  ngOnInit(): void {
    this.getFolders();
  }

  uploadFiles() {
    console.log(this.selectedFolder);
    const arr = this.selectedFolder.split('/');
    const folderName = arr[arr.length - 1];
    const res = uploadFilesIpc({
      folderName: this.selectedFolder,
      validationRule: validationConfig.find(
        (item) => item.folderName === folderName
      )?.validation,
    });
    console.log('res', res);
  }

  getFiles(item: Item) {
    this.selectedFolder = item.name;
    console.log('get files');
    const res: FileItem[] = getFilesIpc(item.name);
    this.dataSource = [];
    res.forEach((item) => this.dataSource.push(item));
    console.log('getFilesIpc res', res);
  }

  getFolders() {
    console.log('get folders');
    const res = getFoldersIpc();
    this.items = [];
    res.forEach((item: string) => this.items.push({ id: item, name: item }));
    console.log('getFoldersIpc res', res);
  }
}

export interface FileItem {
  name: string;
  size: number;
  fileValidationRule: FileValidationRule;
}

export interface Item {
  id: string;
  name: string;
}

export interface FileValidationRule {
  maxSize: number;
  fileExtensions: string[];
}

const validationConfig: {
  folderName: string;
  validation: FileValidationRule;
}[] = [
  {
    folderName: 'exe files',
    validation: {
      maxSize: 2000,
      fileExtensions: ['exe'],
    },
  },
  {
    folderName: 'json files',
    validation: {
      maxSize: 2,
      fileExtensions: ['json'],
    },
  },
  {
    folderName: 'json xml files',
    validation: {
      maxSize: 2,
      fileExtensions: ['json', 'xml'],
    },
  },
];
