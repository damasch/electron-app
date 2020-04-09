# How I build my first Electron App

Electron + Angular + Python 
----

The full guide to create a powerful app.
With a little bit bootstrap UI.

This tutorial is written for:

Node JS
* Angular 9.1.0
* Node: 13.12.0
* OS: darwin x64
* Electron": 8.2.0,
* Electron Builder": ^22.4.1
* Python-shell: ^1.0.8"
* Bootstrap: 4.4.1
* jQuery: 3.4.1

Python
* Python: 3.7.0

IDE: 
* VSCode
* Sublime
* XCode

OS:
* OS Catalina 10.15.4



# Setup
## Installing
### Angular

Install Angular

```bash
npm install -g @angular/cli^9
```

Create a new app with

```bash
ng new electron-app
```

```bash
? Would you like to add Angular routing?(y/N) N
```

Select the style development. Use scss in my tutorial it is better for my common examples

```bash
? Which stylesheet format would you like to use? 
  CSS 
❯ SCSS   [ https://sass-lang.com/documentation/syntax#scss                ] 
  Sass   [ https://sass-lang.com/documentation/syntax#the-indented-syntax ] 
  Less   [ http://lesscss.org                                             ] 
  Stylus [ http://stylus-lang.com                                         ] 
```

```
cd electron-app
```

### Electron

Install electron and electron-builder via npm on your project `package.json`.

```bash
npm install --save-dev electron electron-builder
```

Now you need a types package for angular for using electron in a module.

```bash
npm install --save @types/electron
```

### Python 

Install python on your system.
On a windows machine may you need to allow long path names.
For this case select the checkbox in the installation or setup in the registry.

Install python-shell for node js projects.

```bash
npm install --save python-shell 
```

## Node package setup

Replace the origin scripts entry.

```json
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "test": "ng test",
  "lint": "ng lint",
  "e2e": "ng e2e"
},
```

With a bunch of new script information.

```json
"scripts": {
  "ng": "ng serve",
  "clean": "rimraf dist",
  "prestart": "npm run build",
  "start": "electron .",
  "prebuild": "npm run clean",
  "build": "tsc -p electron/ && ng build",
  "test": "ng test",
  "lint": "ng lint",
  "e2e": "ng e2e",
  "prerelease": "npm run build -- --prod",
  "release": "electron-builder"
},
```

Got to the end of the `scripts` node of the package.json and add the `build` node beyond the `root` node
(of the json).

```json
"build": {
  "appId": "com.dave.electronapp",
  "productName": "Electron App",
  "asar": false,
  "extraResources": [ ],
  "files": [
    "dist/electron-app"
  ]
}
```

Asar is a package. More information on the end of this docuemnt.

## Entry point and Build operations

The normal entry point is the `src/main.ts` file. 
But for electron you need a wrapper for the application.
In the common tutorials you have to add a `app.js` with the basic code.
But I will show you my way for your electron/python application.

### Create the Wrapper

The electron application needs a starting application and settings for the window.

#### Electron Directory
Create a directory in the root directory.
```
mkdir electron
```

#### Application Class
Create a `build` directory in the `electron` directory.

```
mkdir electron/build
```

Create a class file `electron-application.ts` in the `electron/build` directory.

```
touch electron/build/electron-application.ts
```

Content of the `electron/build/electron-application.ts` file:

```typescript

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

  constructor() {
    app.allowRendererProcessReuse = true;

    // Start when application is loaded
    app.on('ready', this.initWindow);

    // Close when all windows are closed.
    app.on('window-all-closed', this.onWindowAllClosed);

    // May initwindow
    app.on('activate', this.onActivate);
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
        pathname: path.join(app.getAppPath(), 'dist/electron-app/src/app/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );

    this.appWindow.webContents.openDevTools();

    this.appWindow.on('closed', () => {
        this.appWindow = null;
    });
  }
}

```

#### Application wrapper
Add a file with the name ```app.ts``` in the `electron` directory of your project.

```
touch electron/app.ts
```

Content of the file `electron/app.ts` is:
```typescript
import { ElectronApplication } from './build/electron-application';

const electron = new ElectronApplication();
```

#### Create a tsc build reference
Create a `tsconfig.json` file in the `electron` directory.

```
touch electron/tsconfig.json
```

Content of the  file is:

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "../dist/electron-app",
    "sourceMap": true,
    "declaration": false,
    "emitDecoratorMetadata": true,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "es5",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2018",
      "dom"
    ]
  }
}
```

#### Update the package.json on root
Define the main script file in the ```package.json```  with adding the ```"main": "dist/electron-app/app.js",``` value under the root node.
Edit the `build` node in the `scripts` node `"build": "tsc -p electron/ && ng build",`
To generate the `app.js` to load the window with the angular application wrapper.

#### Update the angular config
Update the angular.json on root.
Change the `outputPath` node to `"outputPath": "dist/electron-app/src/app",`

### Update the index.html

In the `scr/index.html` change the `<base href="/">` to `<base href="./">`.

Change the Meta tag view port.

From: 

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

To:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
```

# First Start of your app

Start your app `npm run start`.

```bash
> electron-app@0.0.0 prestart /Users/dave/Development/Projects/electron/electron-app
> npm run build


> electron-app@0.0.0 prebuild /Users/dave/Development/Projects/electron/electron-app
> npm run clean


> electron-app@0.0.0 clean /Users/dave/Development/Projects/electron/electron-app
> rimraf dist


> electron-app@0.0.0 build /Users/dave/Development/Projects/electron/electron-app
> ng build

Generating ES5 bundles for differential loading...
ES5 bundle generation complete.

chunk {polyfills} polyfills-es2015.js, polyfills-es2015.js.map (polyfills) 141 kB [initial] [rendered]
chunk {polyfills-es5} polyfills-es5.js, polyfills-es5.js.map (polyfills-es5) 656 kB [initial] [rendered]
chunk {main} main-es2015.js, main-es2015.js.map (main) 55.7 kB [initial] [rendered]
chunk {main} main-es5.js, main-es5.js.map (main) 58.1 kB [initial] [rendered]
chunk {runtime} runtime-es2015.js, runtime-es2015.js.map (runtime) 6.16 kB [entry] [rendered]
chunk {runtime} runtime-es5.js, runtime-es5.js.map (runtime) 6.16 kB [entry] [rendered]
chunk {styles} styles-es2015.js, styles-es2015.js.map (styles) 10.1 kB [initial] [rendered]
chunk {styles} styles-es5.js, styles-es5.js.map (styles) 11.3 kB [initial] [rendered]
chunk {vendor} vendor-es2015.js, vendor-es2015.js.map (vendor) 2.37 MB [initial] [rendered]
chunk {vendor} vendor-es5.js, vendor-es5.js.map (vendor) 2.77 MB [initial] [rendered]
Date: 2020-03-30T15:34:06.773Z - Hash: 71e65ccdfd2bb4111990 - Time: 16637ms

> electron-app@0.0.0 start /Users/dave/Development/Projects/electron/electron-app
> electron .

```

After that, electron start you application.
And the basic Angular Application should be displayed.

If you don't want to see the Developer tools.
Go to the `app.js` file and remove or comment
the `this.appWindow.webContents.openDevTools();` part.

## Debugging tipps

If this app will not running.
Check the names and the directories of your project.

# Intermission styling

If you don't want bootstrap or anything like that, skip this section and jump to **Generate a featured module**.
For a nice view i have installed bootstrap, jQuery and fontawsome as node modules.
Install:
```
npm install --save-dev bootstrap jquery popper.js
```
I choose this way, because i want to theme up my bootstrap. 
It is important to write the jquery module in lower case.

## Update the angular.json

Load the scripts into the angular project.
The angular.json scripts node (projects -> electron-app -> architect -> build -> options -> scripts) get this values.

```json
"scripts": [
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/popper.js/dist/popper.min.js",
  "node_modules/bootstrap/dist/js/bootstrap.min.js"
]
```

## Import the styles

Open the `src/styles.scss` and import the bootstrap scss.

```scss
@import "~bootstrap/scss/bootstrap";
```

# Generate a featured module

Add a module `ng generate module features/my-feature`.
Add a component `ng generate component features/my-feature`.

Edit the `src/app/features/my-feature/my-feature.module.ts`.

From:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MyFeatureModule { }
```

To:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFeatureComponent } from './my-feature.component';

@NgModule({
  declarations: [
    MyFeatureComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MyFeatureComponent
  ]
})
export class MyFeatureModule { }
```

Edit the markup for the feature module `my-feature`.

Edit the `src/app/features/my-feature/my-feature.component.html` a replace all the code with this part.

```html
<div class="container text-center">
  <h1>My Electron App</h1>
  <h2>Do something</h2>
  <button 
    type="button"
    class="btn btn-primary">
      Run Script
  </button>
</div>
```

Import the `my-feature` module into the app model.

Edit the `src/app.module.ts`:
```typescript
import { MyFeatureModule } from './features/my-feature/my-feature.module';

...
  
  imports: [
    BrowserModule,
    MyFeatureModule
  ]

...
```

Load the feature in the `app.component.html`.

```html
<app-my-feature></app-my-feature>
```

Test the app with `npm run start`.

# Add Python

For my setup i create a python dir into my feature model directory.

```
mkdir -p python/features/my-feature
```

Add an external git repo or create your own python setup.
For this example i have add a simple script.

```
touch python/features/my-feature/hello.py
````

Edit the `hello.py` script and add this part.

```python
import sys
print('Hello from Python!')
sys.stdout.flush()
```

## Extract the python

For a build process the python script needs to be exported to the dist directory.

On the build command there is no script path.
```bash
npm run start
```

First add the python path of your feature model into the `angular.json` config.

```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
    "glob": "**/*",
    "input": "python/",
    "output": "../../python"
  }
],
```
Parallel in the `package.json` you have to modify the `build` node.
Add the extra resources node. This is for the final application.
Asar is a simple extensive archive format. The extra resources are deployed in this package.
```json
"extraResources": [
  {
    "filter": "**/*",
    "from": "python/features",
    "to": "app/python/features"
  }
],
```

Run the build process again and check the dist directory.
```bash
npm run start
```

# Connect angular with electron

## Add click event
Go to the `src/app/features/my-feature/my-feature.component.html` and add a `(click)` event function.

```html
<button (click)="runPythonScriptClick()" 
  type="button"
  class="btn btn-primary">
    Run Script
</button>
```

## Integrate the IPC

You need an Inter Process Communication with electron and your angular application.
You have install the `@types/electron` in your package?
No? Do it!

Edit the `scr/app/features/my-feature/my-feature.component.ts`.

*This is for testing i try to keep the code simple. Elegance comes later*
```typescript
import { Component, OnInit } from '@angular/core';
import { IpcRenderer } from 'electron';

@Component({
  selector: 'app-my-feature',
  templateUrl: './my-feature.component.html',
  styleUrls: ['./my-feature.component.scss']
})
export class MyFeatureComponent implements OnInit {
  private ipc: IpcRenderer;

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
    this.ipc.send('runMyFeatruePythonScript');

    this.ipc.once('runMyFeatruePythonScriptResult', (event, data) => {
      console.log(event, data);
    });
  }

  runPythonScriptClick() {
    this.runPythonScript();
  }

  ngOnInit(): void {
  }

}
```

Update the `electron/build/electron-application.ts`.
Add the next code snippet into the constructor. 

```javascript
ipcMain.on('runMyFeatruePythonScript', (event, args) => {
  const dialogOptions1 = {
    type: 'none',
    buttons: ['OK'],
    title: 'Question',
    message: 'Result py script',
    detail: 'IPC Works'
  };
  dialog.showMessageBox(null, dialogOptions1);
  // event.sender.send('runMyFeatruePythonScriptRecive', 'done');
});
```

Now start the application with `npm run start` and click the `Run Script` Button.

Now you want to get the information from a IPC output in the angular application.
Modify in the `electron/build/electron-application.ts` this part of code (remove the comment).

```javascript
  event.sender.send('runMyFeatruePythonScriptRecive', 'done');
```

# Integrate Python-Shell

For python it would be nice if you can use a helper for every integration of a new feature model.

## Generate a common generic class
We create a generic class `PythonOptions`.

```
ng generate class lib/python/PythonOptions
```

Content:
```typescript
export class PythonOptions<T> {
  scriptPath: string;
  scriptFile: string;
  ipcSend: string;
  ipcReceive: string;
  args: T;
}
```

## lib for your feature

Generate a interface `MyPythonArguments`.

```
ng generate interface features/my-feature/MyPythonArguments
```

```typescript
export interface MyPythonArguments {
  arg1?: string;
  arg2: number;
  arg3: boolean;
}
```

## Integrate the libs 

Integrate the interface and the common `PythonArguments` in the `src/app/features/my-feature/my-feature.component.ts`.

```typescript
import { PythonOptions } from '../../lib/python/python-options';
import { MyPythonArguments } from './lib/my-python-arguments';
```

Update the `runPythonScript()` function.

```typescript
runPythonScript() {
  const pyopts: PythonOptions<MyPythonArguments> = {
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
  this.ipc.send(pyopts.ipcSend, pyopts);

  this.ipc.once(pyopts.ipcReceive, (event, data) => {
    console.log(event, data);
  });
}
```

Update the `electron/build/electron-application.ts`.

```javascript
ipcMain.on('runMyFeaturePythonScript', (event, args) => {
  const argsString = JSON.stringify(args);
  const dialogOptions1 = {
    type: 'none',
    buttons: ['OK'],
    title: 'Question',
    message: 'Result py script',
    detail: argsString
  };
  dialog.showMessageBox(null, dialogOptions1);
  event.sender.send(args.ipcReceive, args.args);
});
```

# Regsitry

At this point, our feature module call with `this.ipc.send(pyopts.ipcSend, pyopts);` the ipcMain in the `electron/build/electron-application.ts` `ElectronApplication` class.
This is ok, but if ou have more calls an other operations like electron `showOpenDialog` method, you have to create a lot of these functionality. 

## Feature regsitry 

Add a new File in our feature model for the electron registry.

Create feature registry directory
```
mkdir -p electron/build/features/my-feature
```

```
touch electron/build/features/my-feature/my-feature.ipc.ts
```

Content:
```typescript
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
```

## Electron regsitry

Add a new file for the registry.

```
touch electron/build/electron-registry.ts
```

Add the feature to the registry

Content:
```typescript
import { MyFeatureIPC } from './features/my-feature/my-feature.ipc';

export class ElectronRegistry {
  myFeature = new MyFeatureIPC();
}
```

Add the registry in the `electron/build/electron-application.ts` and import this feature.

```typescript
import { ElectronRegistry } from './electron-registry';
```

Add a property to the class.
```typescript
registry: ElectronRegistry = null;
```

Replace the `ipcMain.on('runMyFeaturePythonScript' ...` call with the an instance of the registry.

```
this.registry = new ElectronRegistry();
```

# Asar 

In the build node of the package.json you can set up the asar variable.

If you have a Error message like that:

> Uncaught Exception:
> 
> Error: /Applications/Xcode.app/Contents/Developer/Library/
> Frameworks/Python3.framework/Versions/3.7/Resources/Python.app/
Contents/MacOS/Python: can't open file '/Users/dave/Development/
Projects/electron/electron-app/dist/mac/Electron App.app/
Contents/Resources/app.asar/dist/electron-app/app/features/
my-feature/python/hello.py': [Errno 20] Not a directory

With `"asar": false` you have a directory for your sources.
Check the path of your scripts to debug this type of error.

In the deployment process you may have a notification like that.

```bash
asar usage is disabled — this is strongly not recommended  solution=enable asar and use asarUnpack to unpack files that must be externally available
```

For this problem with python you can add a specific directory witch is not packed in a asar package.

Remove Asar node or set it on true,
```json
"asar": false,
```

Add the python directory into the `asarUpack` list.
```json
"asarUnpack": [
  "app/python/features"
]
```

But. If you have to create a logic for asar handling. 
And you can't access the python script not from the CLI.
So, I preferr the ```"asar": false,``` Method.

# A important melting Point

If the data changes in the application, normaly angular detect the changes (ChangeDetectorRef) by itself.
But angular in a elctron app, you have update the data with zone.js.

For this case update the `src/app/features/my-feature/my-feature.component.ts` file.

Add NgZone to your component.
```typescript
import { Component, OnInit, NgZone } from '@angular/core';
```

Initialize NgZone in the contructor.
```typescript
constructor(private zone: NgZone) {
```

Update the data for the view with:
```typescript
this.zone.run(() => {
  this.myTitle = 'foo';
});
```

Example:
```typescript
mydata: any;
runPythonScript() {
  this.ipc.send(this.pyopts.ipcSend, this.pyopts);

  this.ipc.once(this.pyopts.ipcReceive, (event, data) => {
    console.log(event, data);

    this.zone.run(() => {
      this.mydata = data;
    });
  });
}
```

# Start/Build/Release the app

After debugging with `npm run start` and everything is ok, build your app.

With `npm run release` you will create an application.




