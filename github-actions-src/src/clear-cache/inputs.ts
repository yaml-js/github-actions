import { InputsSchema } from '../action'
import { ActionInputs, actionInputsSchema } from '../actionInputs'

export interface Inputs extends ActionInputs {
  prefix: string
}

export const inputsSchema: InputsSchema = {
  ...actionInputsSchema,
  prefix: 'prefix'
}
