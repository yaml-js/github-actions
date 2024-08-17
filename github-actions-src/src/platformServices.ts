import { Endpoints, RequestParameters } from '@octokit/types'

export interface InputOptions {
  required?: boolean
  trimWhitespace?: boolean
}

export interface Context {
  eventName: string
  sha: string
  ref: string
  workflow: string
  action: string
  actor: string
  job: string
  runNumber: number
  runId: number
  apiUrl: string
  serverUrl: string
  graphqlUrl: string

  get issue(): {
    owner: string
    repo: string
    number: number
  }

  get repo(): {
    owner: string
    repo: string
  }
}

export type ApiOperation = keyof Endpoints
export type ApiRequestParameters<T extends ApiOperation> = Endpoints[T]['parameters'] & RequestParameters
export type ApiResponse<T extends ApiOperation> = Endpoints[T]['response']

export interface GitHubApiClient {
  request<T extends ApiOperation>(operation: T, options?: ApiRequestParameters<T>): Promise<ApiResponse<T>>
}

export interface PlatformServices {
  getEnv(name: string): string
  getInput(name: string, options?: InputOptions): string
  setOutput<T>(name: string, value: T): void
  setFailed(message: string | Error): void
  debug(message: string): void
  error(message: string | Error): void
  warning(message: string | Error): void
  info(message: string): void
  getGitHubApiClient(token: string): GitHubApiClient
  getContext(): Context
  getToken(): string
}
