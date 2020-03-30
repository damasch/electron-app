import { MyFeatureIPC } from './features/my-feature/my-feature.ipc';

export class ElectronRegistry {
  myFeature = new MyFeatureIPC();
}
