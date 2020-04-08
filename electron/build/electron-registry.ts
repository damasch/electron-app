import { IpcRegistry } from './core';
import { MyFeatureIPC } from './features/my-feature/my-feature.ipc';

@IpcRegistry({
  ipcs: [
    MyFeatureIPC
  ]
})
export class ElectronRegistry {
  version = '1.0.0';
  constructor() {}
}
