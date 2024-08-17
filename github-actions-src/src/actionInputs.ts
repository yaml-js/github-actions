import { InputsSchema } from './action'

export interface ActionInputs {
  logLevel: string
  [key: string]: string
}

export const actionInputsSchema: InputsSchema = {
  logLevel: 'log-level'
}
