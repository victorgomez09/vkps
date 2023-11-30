import { createFieldStore } from './store';
import { FieldOptions, defaultFieldOptions } from './types';
import { Validator } from './types';

export function field<T>(
  name: string,
  value: T,
  validators: Validator[] = [],
  options: Partial<FieldOptions> = {}
) {
  return createFieldStore(name, value, validators, { ...defaultFieldOptions, ...options });
}
