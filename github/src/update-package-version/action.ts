import glob from '@actions/glob'
import core from '@actions/core'
import fs from 'fs/promises'

import { createAction } from "../action";
import { createLogger } from "../logger";
import { Inputs, inputsSchema } from "./inputs";

export const UpdatePackageVersion = () => {
  const action = createAction(inputsSchema, async (inputs: Inputs) => {
    const logger = createLogger("UpdatePackageVersion", inputs.logLevel);
    logger.debug(() => "Running UpdatePackageVersion action", inputs);

    const tag = inputs.tag;
    let version = tag;
    if (inputs.tag.toLowerCase().startsWith(inputs.prefix.toLowerCase())) {
      version = tag.substring(inputs.prefix.length);
    }
    logger.debug(() => `Using ${version} as package version`);

    const patterns = [inputs.path, '!**/node_modules']
    const globber = await glob.create(patterns.join('\n'))
    for await (const file of globber.globGenerator()) {
      // Update package version in file
      const packageString = await fs.readFile(file, { encoding: 'utf-8' })
      const packageJson = JSON.parse(packageString)
      if (packageJson['version'] === "${FROM_TAG}") {
        packageJson['version'] = version
        const updatedJson = JSON.stringify(packageJson, null, 2)

        logger.info(() => `Updating version in ${file}`)
        logger.debug(() => `Updating file ${file} with version ${version}`, updatedJson)

        await fs.writeFile(file, updatedJson, { encoding: 'utf-8' })
      }
    }
    core.setOutput('package-version', version)
  })

  action();
}
