import { IpcRegistryInterface } from './ipcRegistry.interface';


export function IpcRegistry(settings?: IpcRegistryInterface) {
  return function IpcRegistryInfo<T extends new(...args: any[]) => {}>(target: T) {
    // tslint:disable-next-line: max-classes-per-file
    return class extends target implements IpcRegistryInterface {
      ipcs?: any[];
      public constructor(...args: any[]) {
        super();
        this.ipcs = settings.ipcs;
      }
    };
  };
}


