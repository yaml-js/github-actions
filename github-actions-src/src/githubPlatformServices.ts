import * as core from '@actions/core'

import { PlatformServices, InputOptions, GitHubApiClient, ApiOperation, ApiResponse, ApiRequestParameters } from './platformServices'

class ApiClient implements GitHubApiClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private octokit: any = undefined
  private headers = { 'X-GitHub-Api-Version': '2022-11-28' }

  constructor(private token: string) {}

  async request<T extends ApiOperation>(operation: T, options?: ApiRequestParameters<T>): Promise<ApiResponse<T>> {
    if (!this.octokit) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const github = require('@actions/github')
      this.octokit = github.getOctokit(this.token)
    }

    let optionsWithHeaders = { ...options, headers: this.headers }
    if (options && options.headers) {
      optionsWithHeaders = { ...options, headers: { ...this.headers, ...options.headers } }
    }

    const result = await this.octokit.request(operation, optionsWithHeaders)
    return result as ApiResponse<T>
  }
}
export const GitHubPlatformServices = () => {
  return {
    getEnv(name: string): string {
      return process.env[name] ?? ''
    },
    getInput(name: string, options?: InputOptions): string {
      return core.getInput(name, options)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOutput(name: string, value: any) {
      core.setOutput(name, value)
    },
    setFailed(message: string | Error) {
      core.setFailed(message)
    },
    debug(message: string) {
      core.debug(message)
    },
    error(message: string | Error) {
      core.error(message)
    },
    warning(message: string | Error) {
      core.warning(message)
    },
    info(message: string) {
      core.info(message)
    },
    getGitHubApiClient(token: string) {
      return new ApiClient(token)
    },
    getContext() {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const github = require('@actions/github')
      return github.context
    },
    getToken() {
      return process.env.GITHUB_TOKEN ?? ''
    }
  } as PlatformServices
}
