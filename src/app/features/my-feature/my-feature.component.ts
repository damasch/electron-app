import { Component, OnInit } from '@angular/core';
import { IpcRenderer } from 'electron';
import { PythonOptions } from '../../lib/python/python-options';
import { MyPythonArguments } from './my-python-arguments';

@Component({
  selector: 'app-my-feature',
  templateUrl: './my-feature.component.html',
  styleUrls: ['./my-feature.component.scss']
})
export class MyFeatureComponent implements OnInit {
  ipc: IpcRenderer;
  pyopts: PythonOptions<MyPythonArguments> = {
    scriptPath: 'python/features/my-feature',
    scriptFile: 'hello.py',
    ipcSend: 'runMyFeaturePythonScript',
    ipcReceive: 'runMyFeaturePythonScriptReceive',
    args: {
      arg1: '1337',
      arg2: 123,
      arg3: false
    }
  };

  constructor() {
    if ((window as any).require) {
      try {
        this.ipc = (window as any).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
  }

  runPythonScript() {
    this.ipc.send(this.pyopts.ipcSend, this.pyopts);

    this.ipc.once(this.pyopts.ipcReceive, (event, data) => {
      console.log(event, data);
    });
  }

  runPythonScriptClick() {
    this.runPythonScript();
  }

  ngOnInit(): void {
  }

}
