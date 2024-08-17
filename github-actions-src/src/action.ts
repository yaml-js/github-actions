import { ActionInputs } from './actionInputs'
import { createLogger, Logger } from './logger'
import { PlatformServices } from './platformServices'

export type Action = () => Promise<void>
export type ActionFunc<T extends ActionInputs> = (logger: Logger, inputs: T) => Promise<void>
export type InputsSchema = {
  [key: string]: string
}

export const setFailed = (platformServices: PlatformServices, error: Error | unknown | string) => {
  if (error instanceof Error) {
    platformServices.setFailed(error.message)
  } else if (typeof error === 'string') {
    platformServices.setFailed(error)
  } else {
    platformServices.setFailed(JSON.stringify(error))
  }
}

const getInputs = <T>(platformServices: PlatformServices, schema: InputsSchema): T => {
  const inputs: ActionInputs = { logLevel: 'INFO' }
  for (const key in schema) {
    inputs[key] = platformServices.getInput(schema[key])
  }
  return inputs as T
}

export const createAction = <T extends ActionInputs>(platformServices: PlatformServices, name: string, schema: InputsSchema, func: ActionFunc<T>) => {
  const result = async () => {
    const inputs = getInputs<T>(platformServices, schema)
    try {
      await func(createLogger(platformServices, name, inputs.logLevel), inputs)
    } catch (error) {
      setFailed(platformServices, error)
      throw error
    }
  }

  return result
}
