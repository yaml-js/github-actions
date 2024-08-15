import fs from 'fs';
import path from 'path';

import { createLocalRepo } from '../utils'
import { ActionInputs } from '../../src/actionInputs';
import { InputOptions, PlatformServices } from '../../src/platformServices';
import { UpdatePackageVersion } from '../../src/update-package-version/action';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const createPlatformServices = <T extends ActionInputs>(env: Record<string, string>, inputs: T, outputs: {}): PlatformServices => {
  return {
    getEnv(name: string): string { return env[name] || '' },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getInput(name: string, _options?: InputOptions): string { return inputs[name] },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOutput(name: string, value: any) { outputs[name] = value },
    setFailed(message: string | Error) { outputs["FAILED"] = message },
    debug(message: string) { console.debug(message) },
    error(message: string | Error) { console.error(message) },
    warning(message: string | Error) { console.warn(message) },
    info(message: string) { console.info(message) },
  } as PlatformServices
}

describe('UpdatePackageVersion unit tests', () => {

  it('Scenario 01: Version is replaced when input is a single file', async () => {
    const folder = createLocalRepo();
    const inputs = { logLevel: "INFO", path: "package.json", tag: 'v1.0.0', prefix: 'v' };
    const outputs = {};
    const platform = createPlatformServices({"GITHUB_WORKSPACE": folder}, inputs, outputs);

    const action = UpdatePackageVersion(platform);
    await action();

    let actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("1.0.0");

    actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'packages/package1/package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("${FROM TAG}");

    actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'packages/package2/package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("0.1.0");

    fs.rmSync(folder, { recursive: true })
  });

  it('Scenario 02: Version is replaced when input is a glob pattern file', async () => {
    const folder = createLocalRepo();
    const inputs = { logLevel: "INFO", path: "**/package.json", tag: 'v1.0.0', prefix: 'v' };
    const outputs = {};
    const platform = createPlatformServices({"GITHUB_WORKSPACE": folder}, inputs, outputs);

    const action = UpdatePackageVersion(platform);
    await action();

    let actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("1.0.0");

    actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'packages/package1/package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("1.0.0");

    actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'packages/package2/package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("0.1.0");

    fs.rmSync(folder, { recursive: true })
  });
});
