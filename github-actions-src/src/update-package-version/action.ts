import glob from 'fast-glob'
import fs from 'fs/promises'

import { Action, createAction } from '../action'
import { Logger } from '../logger'
import { Inputs, inputsSchema } from './inputs'
import { PlatformServices } from '../platformServices'
import { GitHubPlatformServices } from '../githubPlatformServices'

export const UpdatePackageVersion = (platform: PlatformServices = GitHubPlatformServices()): Action => {
  return createAction<Inputs>(platform, 'UpdatePackageVersion', inputsSchema, async (logger: Logger, inputs: Inputs) => {
    logger.debug(() => 'Running UpdatePackageVersion action', inputs)

    const workspaceDir = platform.getEnv('GITHUB_WORKSPACE') || process.cwd()
    const tag = inputs.tag
    let version = tag
    if (inputs.tag.toLowerCase().startsWith(inputs.prefix.toLowerCase())) {
      version = tag.substring(inputs.prefix.length)
    }
    logger.debug(() => `Using ${version} as package version`)

    const globber = glob.stream(inputs.path, { absolute: true, cwd: workspaceDir, ignore: ['**/node_modules/**'] })
    for await (const file of globber) {
      // Update package version in file

      const packageString = await fs.readFile(file, { encoding: 'utf-8' })
      const packageJson = JSON.parse(packageString)
      if (packageJson['version'] === '${FROM TAG}') {
        packageJson['version'] = version
        const updatedJson = JSON.stringify(packageJson, null, 2)

        logger.info(() => `Updating version in ${file}`)
        logger.debug(() => `Updating file ${file} with version ${version}`, updatedJson)

        await fs.writeFile(file, updatedJson, { flush: true })
        logger.info(() => `Version updated in ${file}`)
      }
    }
    platform.setOutput('package-version', version)
  })
}
