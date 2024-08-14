import { InputsSchema } from "./action"

export interface ActionInputs {
  logLevel: string
}

export const actionInputsSchema: InputsSchema = {
  logLevel: 'log-level'
}
