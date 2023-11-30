import type { FieldValidation, Validator } from '../types';

export function not(validation: Validator) {
  return async (value: any) => {
    const validator = validation(value);

    if (validator && (<Promise<FieldValidation>>validator).then !== undefined) {
      const result = await validator;
      return { valid: !result.valid, name: result.name };
    }

    return {
      valid: !(validator as FieldValidation).valid,
      name: (validator as FieldValidation).name
    };
  };
}
