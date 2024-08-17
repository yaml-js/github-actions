import { Action, createAction } from '../action'
import { Logger } from '../logger'
import { Inputs, inputsSchema } from './inputs'
import { PlatformServices } from '../platformServices'
import { GitHubPlatformServices } from '../githubPlatformServices'

export const ClearCache = (platform: PlatformServices = GitHubPlatformServices()): Action => {
  return createAction<Inputs>(platform, 'ClearCache', inputsSchema, async (logger: Logger, inputs: Inputs) => {
    logger.debug(() => 'Running ClearCache action', inputs)

    const octokit = platform.getGitHubApiClient(platform.getToken())
    const owner = platform.getContext().repo.owner
    const repo = platform.getContext().repo.repo

    logger.debug(() => `GET /repos/${owner}/${repo}/actions/caches`)
    const options = {
      owner: owner,
      repo: repo
    }

    const res = await octokit.request('GET /repos/{owner}/{repo}/actions/caches', options)
    logger.debug(() => `Found ${res.data.total_count} caches`)

    const caches = res.data.actions_caches
    for (const cache of caches) {
      if (cache.id !== undefined && (inputs.prefix === undefined || inputs.prefix === '' || (cache.key && cache.key.startsWith(inputs.prefix)))) {
        logger.debug(() => `DELETE /repos/${owner}/${repo}/actions/caches/${cache.id}`)
        await octokit.request('DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}', { ...options, cache_id: cache.id })
        logger.info(() => `Deleted cache ${cache.key}`)
      }
    }
  })
}
