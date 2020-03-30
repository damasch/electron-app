
import { ElectronRegistry } from './electron-registry';
import {
  app,
  BrowserWindow,
  ipcMain,
  dialog
} from 'electron';
import * as path from 'path';
import * as url from 'url';


export class ElectronApplication {
  appWindow = null;
  dialog = dialog;
  ipcMain = ipcMain;
  app = app;
  registry: ElectronRegistry = null;

  constructor() {
    this.app.allowRendererProcessReuse = true;

    // Start when application is loaded
    this.app.on('ready', this.initWindow);

    // Close when all windows are closed.
    this.app.on('window-all-closed', this.onWindowAllClosed);

    // May initwindow
    this.app.on('activate', this.onActivate);

    this.registry = new ElectronRegistry();
  }

  onActivate() {
    if (this.appWindow === null) {
      this.initWindow();
    }
  }

  onWindowAllClosed() {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  initWindow() {
    this.appWindow = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
      }
    });

    // Electron Build Path
    this.appWindow.loadURL(
      url.format({
        pathname: path.join(
          app.getAppPath(), 
          'dist/electron-app/src/app/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );

    // if (environment.devTools) {
    // this.appWindow.webContents.openDevTools();
    // }

    this.appWindow.on('closed', () => {
        this.appWindow = null;
    });
  }
}
