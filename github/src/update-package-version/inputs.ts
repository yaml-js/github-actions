import { InputsSchema } from "../action";
import { ActionInputs, actionInputsSchema } from "../actionInputs";

export interface Inputs extends ActionInputs {
  path: string;
  tag: string;
  prefix: string
}

export const inputsSchema: InputsSchema = {
  ...actionInputsSchema,
  path: 'path',
  tag: 'tag',
  prefix: 'prefix'
}
