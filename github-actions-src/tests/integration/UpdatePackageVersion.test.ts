import fs from 'fs';
import path from 'path';
import {RunTarget, RunOptions} from 'github-action-ts-run-api';

import { createLocalRepo } from '../utils'
import { UpdatePackageVersion } from '../../src/update-package-version/action';

describe('UpdatePackageVersion action integrations tests', () => {

  const jsFile = path.join(__dirname, '../../lib/update-package-version/index.js');
  const actionFile = path.join(__dirname, '../../../github-actions/update-package-version/action.yml');

  afterEach(() => {
    jest.resetModules();
  });

  it('Scenario 01: Version is replaced when input is a single file (direct function execution)', async () => {
    const folder = createLocalRepo();
    const action = UpdatePackageVersion();
    const target = RunTarget.asyncFn(action, actionFile);
    const res = await target.run(RunOptions.create()
      .setEnv({
        GITHUB_TOKEN: "token",
        GITHUB_REPOSITORY: "https://github.com/yaml-js/build"
      })
      .setInputs({
        "log-level": "DEBUG",
        tag: 'v0.1.1',
        path: 'package.json'
      })
      .setWorkspaceDir(folder)
    );

    const actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("0.1.1");

    expect(res.isSuccess).toEqual(true);
    expect(res.commands.outputs["package-version"]).toEqual('0.1.1');

    fs.rmSync(folder, { recursive: true })
  });

  it('Scenario 02: Version is replaced on the file when input is a single file', async () => {
    const folder = createLocalRepo();
    const target = RunTarget.jsFile(jsFile, actionFile);
    const res = await target.run(RunOptions.create()
      .setEnv({
        GITHUB_TOKEN: "token",
        GITHUB_REPOSITORY: "https://github.com/yaml-js/build"
      })
      .setInputs({
        "log-level": "DEBUG",
        tag: 'v0.1.1',
        path: 'package.json'
      })
      .setWorkspaceDir(folder)
    );

    const actualVersion = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'))["version"];
    expect(actualVersion).toEqual("0.1.1");

    expect(res.isSuccess).toEqual(true);
    expect(res.commands.outputs["package-version"]).toEqual('0.1.1');

    fs.rmSync(folder, { recursive: true })
  });
});
