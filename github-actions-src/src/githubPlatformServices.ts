import * as core from '@actions/core';

import { PlatformServices, InputOptions } from './platformServices';

export const GitHubPlatformServices = () => {
  return {
    getEnv(name: string): string { return process.env[name] || '' },
    getInput(name: string, options?: InputOptions): string { return core.getInput(name, options) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOutput(name: string, value: any) { core.setOutput(name, value) },
    setFailed(message: string | Error) { core.setFailed(message) },
    debug(message: string) { core.debug(message) },
    error(message: string | Error) { core.error(message) },
    warning(message: string | Error) { core.warning(message) },
    info(message: string) { core.info(message) },
  } as PlatformServices
}
