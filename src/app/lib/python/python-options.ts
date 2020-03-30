
export class PythonOptions<T> {
  scriptPath: string;
  scriptFile: string;
  ipcSend: string;
  ipcReceive: string;
  args: T;
}
