import * as core from '@actions/core';

export type InputsSchema = {
  [key: string]: string;
}

export const setFailed = (error: Error | unknown | string) => {
  if (error instanceof Error) {
    core.setFailed(error.message);
  } else if (typeof error === 'string') {
    core.setFailed(error);
  } else {
    core.setFailed(JSON.stringify(error));
  }
}

const getInputs = <T>(schema: InputsSchema): T => {
  const inputs: any = {};
  for (const key in schema) {
    inputs[key] = core.getInput(schema[key]);
  }
  return inputs as T;
}

export const createAction = <T>(schema: InputsSchema, func: (inputs: T) => Promise<void>) => {
  return async () => {
    try {
      const inputs = getInputs<T>(schema);
      await func(inputs);
    } catch (error) {
      setFailed(error);
    }
  };
}
