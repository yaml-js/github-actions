import path from 'path';
import * as http from "http";
import { RunTarget, RunOptions } from 'github-action-ts-run-api';

import { ClearCache } from '../../src/clear-cache/action';

const createMockApiServer = (port: number, repository: string, data: {id: string, key: string}[]) => {
  const server = http.createServer((req, res) => {
    if (req.method == "GET" && req.url === `/repos/${repository}/actions/caches`) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ total_count: data.length, actions_caches: [...data] }));
    } else if (req.method == "DELETE" && req.url?.startsWith(`/repos/${repository}/actions/caches/`)) {
      const actionId = req.url.split("/").pop();
      const index = data.findIndex((item) => item.id === actionId);
      if (index >= 0) {
        const item = data.splice(index, 1)[0];
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ total_count: data.length, actions_caches: item }));
      } else {
        res.writeHead(404);
        res.end();
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  }).listen(port);
  return server;
}

describe('ClearCache action integrations tests', () => {

  const jsFile = path.join(__dirname, '../../lib/clear-cache/index.js');
  const actionFile = path.join(__dirname, '../../../github-actions/clear-cache/action.yml');

  afterEach(() => {
    jest.resetModules();
  });

  it('Scenario 01: I am able to delete all workflow cache items that have a key starting by the given prefix', async () => {
    const data = [
      { id: "1", key: "cache1" },
      { id: "2", key: "NOT_cache2" },
      { id: "3", key: "cache3" },
      { id: "4", key: "NOT_cache4" }
    ]
    const repository = "yaml-js/build"
    const mockServer = createMockApiServer(8384, repository, data);
    try {
      const target = RunTarget.jsFile(jsFile, actionFile);
      const res = await target.run(RunOptions.create()
        .setGithubContext({ repository: repository, apiUrl: 'http://localhost:8384' })
        .setInputs({
          "log-level": "DEBUG",
          token: "token",
          prefix: 'cache'
        })
      );

      expect(res.isSuccess).toEqual(true);
      expect (data.length).toEqual(2);
      expect (data[0].id).toEqual("2");
      expect (data[1].id).toEqual("4");
    } finally {
      mockServer.close();
    };
  });

  it('Scenario 02: If no prefix is provided all items are removed', async () => {
    const data = [
      { id: "1", key: "cache1" },
      { id: "2", key: "NOT_cache2" },
      { id: "3", key: "cache3" },
      { id: "4", key: "NOT_cache4" }
    ]
    const repository = "yaml-js/build"
    const mockServer = createMockApiServer(8384, repository, data);
    try {
      const action = ClearCache();
      const target = RunTarget.asyncFn(action, actionFile);
      const res = await target.run(RunOptions.create()
        .setGithubContext({ repository: repository, apiUrl: 'http://localhost:8384' })
        .setInputs({
          "log-level": "DEBUG",
          token: "token",
          prefix: 'cache'
        })
      );

      expect(res.isSuccess).toEqual(true);
      expect (data.length).toEqual(2);
      expect (data[0].id).toEqual("2");
      expect (data[1].id).toEqual("4");
    } finally {
      mockServer.close();
    };
  });
});
