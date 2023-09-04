import * as chokidar from 'chokidar';
import * as path from 'path';
import * as fs from 'fs-extra';

let watcher: chokidar.FSWatcher;
const folderToWatch = path.join(__dirname, '../folder-to-watch');
const copyToFolder = path.join(__dirname, '../copy-to-folder');

export function startWatching() {
  watcher = chokidar.watch(folderToWatch, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  // Something to use when events are received.
  const log = console.log.bind(console);
  // Add event listeners.
  watcher
    .on('add', (path: string, stats: fs.Stats) => {
      log(`File ${path} has been added`);
      log(stats);
      fs.copyFileSync(path, copyToFolder + '/dd.txt');
    })
    .on('change', (path) => log(`File ${path} has been changed`))
    .on('unlink', (path) => log(`File ${path} has been removed`))

    .on('addDir', (path) => {
      log(`Directory ${path} has been added`);
      fs.copySync(path, copyToFolder);
    })
    .on('unlinkDir', (path) => log(`Directory ${path} has been removed`))
    .on('error', (error) => log(`Watcher error: ${error}`))
    .on('ready', () => log('Initial scan complete. Ready for changes'))
    .on('raw', (event, path, details) => {
      log('Raw event info:', event, path, details);
    })
    .on('change', (path, stats) => {
      if (stats) console.log(`File ${path} changed size to ${stats.size}`);
    });
}

export function stopWatching() {
  watcher.close().then(() => console.log('closed'));
}
