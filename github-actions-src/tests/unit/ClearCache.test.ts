import { ActionInputs } from '../../src/actionInputs';
import { InputOptions, Context, GitHubApiClient, PlatformServices, ApiOperation, ApiRequestParameters, ApiResponse } from '../../src/platformServices';
import { ClearCache } from '../../src/clear-cache/action';

const DEFAULT_CONTEXT: Context = {
  eventName: "push",
  sha: "6f1ed002ab5595859014ebf0951522d9a6b2fbb7",
  ref: "refs/heads/main",
  workflow: "CI Workflow",
  action: "build",
  actor: "johndoe",
  job: "build-and-test",
  runNumber: 42,
  runId: 123456789,
  apiUrl: "https://api.github.com",
  serverUrl: "https://github.com",
  graphqlUrl: "https://api.github.com/graphql",

  get issue() {
    return {
      owner: "yaml-js",
      repo: "build",
      number: 27,
    };
  },

  get repo() {
    return {
      owner: "yaml-js",
      repo: "build",
    };
  },
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const createPlatformServices = <T extends ActionInputs>(env: Record<string, string>, inputs: T, outputs: {}, context: Context, cacheItems: Record<string, string>[]): PlatformServices => {
  return {
    getEnv(name: string): string { return env[name] || '' },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getInput(name: string, _options?: InputOptions): string { return inputs[name] },
    setOutput<T>(name: string, value: T) { outputs[name] = value },
    setFailed(message: string | Error) { outputs["FAILED"] = message },
    debug(message: string) { console.debug(message) },
    error(message: string | Error) { console.error(message) },
    warning(message: string | Error) { console.warn(message) },
    info(message: string) { console.info(message) },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getGitHubApiClient(_token) {
      return {
        request<T extends ApiOperation>(operation: T, options?: ApiRequestParameters<T>): Promise<ApiResponse<T>> {
          expect(options).toBeDefined();
          expect(options!["owner"]).toEqual(context.repo.owner);
          expect(options!["repo"]).toEqual(context.repo.repo);

          if (operation === "GET /repos/{owner}/{repo}/actions/caches") {
            return Promise.resolve({ headers: {}, status: 200, url: "url", data: { total_count: cacheItems.length, actions_caches: [...cacheItems] }});
          } else if (operation == "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}") {
            const cacheId = options!["cache_id"];
            const cache = cacheItems.find((item) => item.id === cacheId);
            if (cache) {
              cacheItems.splice(cacheItems.indexOf(cache), 1);
            }
            return Promise.resolve({ headers: {}, status: 200, url: "url", data: { total_count: cacheItems.length, actions_caches: cacheItems }});
          } else {
            throw new Error(`Unexpected operation: ${operation}`);
          }
        }
      } as GitHubApiClient;
    },
    getContext() { return context },
    getToken() { return "" }
  } as PlatformServices
}

describe('ClearCache action unit tests', () => {

  it('Scenario 01: I am able to delete all workflow cache items that have a key starting by the given prefix', async () => {
    const inputs = { logLevel: "INFO", prefix: "cache", token: "token" };
    const outputs = {};
    const data = [
      { id: "1", key: "cache1" },
      { id: "2", key: "NOT_cache2" },
      { id: "3", key: "cache3" },
      { id: "4", key: "NOT_cache4" }
    ]
    const platform = createPlatformServices({}, inputs, outputs, DEFAULT_CONTEXT, data);

    const action = ClearCache(platform);
    await action();

    expect (data.length).toEqual(2);
    expect (data[0].id).toEqual("2");
    expect (data[1].id).toEqual("4");
  });

  it('Scenario 02: If no prefix is provided all items are removed', async () => {
    const inputs = { logLevel: "INFO", token: "token" };
    const outputs = {};
    const data = [
      { id: "1", key: "cache1" },
      { id: "2", key: "NOT_cache2" },
      { id: "3", key: "cache3" },
      { id: "4", key: "NOT_cache4" }
    ]
    const platform = createPlatformServices({}, inputs, outputs, DEFAULT_CONTEXT, data);

    const action = ClearCache(platform);
    await action();

    expect (data.length).toEqual(0);
  });
});
