import fs from 'fs';
import { v4 as uuid } from 'uuid';
import os from 'os';
import path from 'path';

import { ActionInputs } from '../src/actionInputs';
import { InputOptions, PlatformServices } from '../src/platformServices';
import { UpdatePackageVersion } from '../src/update-package-version/action';

const createPlatformServices = <T extends ActionInputs>(inputs: T, outputs: {}): PlatformServices => {
  return {
    getInput(name: string, _options?: InputOptions): string { return inputs[name] },
    getBooleanInput(name: string, _options?: InputOptions): boolean { return inputs[name] as boolean },
    setOutput(name: string, value: any) { outputs[name] = value },
    setFailed(message: string | Error) { outputs["FAILED"] = message },
    debug(message: string) { console.debug(message) },
    error(message: string | Error) { console.error(message) },
    warning(message: string | Error) { console.warn(message) },
    info(message: string) { console.info(message) },
  } as PlatformServices
}

describe('Subject: update package version action', () => {

  const folder = path.join(os.tmpdir(), uuid());

  beforeEach(() => {
    fs.mkdirSync(folder, { recursive: true });
    fs.cpSync(path.join(__dirname, './resources/update-package-version'), folder, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(folder, { recursive: true })
  });

  it('Scenario 01: Version is replaced on the file when input is a single file', async () => {
    const inputs = { logLevel: "INFO", path: path.join(folder, "package.json"), tag: 'v1.0.0', prefix: 'v' };
    const outputs = {};
    const platform = createPlatformServices(inputs, outputs);

    const action = UpdatePackageVersion(platform);
    await action();

    let actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("1.0.0");
  });

  it('Scenario 02: Version is replaced on multiple files when input is a glob pattern file', async () => {
    const inputs = { logLevel: "INFO", path: path.join(folder, "**/package.json"), tag: 'v1.0.0', prefix: 'v' };
    const outputs = {};
    const platform = createPlatformServices(inputs, outputs);

    const action = UpdatePackageVersion(platform);
    await action();

    let actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("1.0.0");

    actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'packages/package1/package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("1.0.0");

    actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'packages/package2/package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("0.1.0");
  });
});
