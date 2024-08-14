export interface InputOptions {
  required?: boolean;
  trimWhitespace?: boolean;
}

export interface PlatformServices {
  getInput(name: string, options?: InputOptions): string;
  getBooleanInput(name: string, options?: InputOptions): boolean;
  setOutput(name: string, value: any): void;
  setFailed(message: string | Error): void;
  debug(message: string): void;
  error(message: string | Error): void;
  warning(message: string | Error): void;
  info(message: string): void;
}
