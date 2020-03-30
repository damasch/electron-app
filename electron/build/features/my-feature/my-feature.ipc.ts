import { ipcMain, app, dialog } from 'electron';
import { PythonShell } from 'python-shell';
import * as path from 'path';

export class MyFeatureIPC {
  constructor() {
    ipcMain.on('runMyFeaturePythonScript', (event, arg) => {
      const pyOptions = {
        scriptPath: path.join(app.getAppPath(), arg.scriptPath)
      };
      PythonShell.run(arg.scriptFile, pyOptions, (err, results) => {
        if (err) {
          throw err;
        }
        const options = {
          type: 'none',
          buttons: ['OK'],
          title: 'Run python Script',
          message: 'Result py script ' + arg.scriptFile,
          detail: results.join('-')
        };
        dialog.showMessageBox(null, options);
        event.sender.send(arg.ipcReceive, results);
      });
    });
  }
}
