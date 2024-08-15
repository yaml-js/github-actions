export interface InputOptions {
  required?: boolean;
  trimWhitespace?: boolean;
}

export interface PlatformServices {
  getEnv(name: string): string;
  getInput(name: string, options?: InputOptions): string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOutput(name: string, value: any): void;
  setFailed(message: string | Error): void;
  debug(message: string): void;
  error(message: string | Error): void;
  warning(message: string | Error): void;
  info(message: string): void;
}
