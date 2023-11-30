import type { Readable, Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import type { Field, FieldOptions } from './types';
import { isField } from './types';
import { FieldValidation, Validator } from './validators/validator';

export function createFieldOject<T>(
  name: string,
  value: T,
  errors: FieldValidation[] = [],
  partialField: Partial<Field<T>> = {}
): Field<T> {
  const field: Field<T> = {
    name,
    value,
    valid: true,
    invalid: false,
    errors: [],
    dirty: false
  };

  return processField(field, errors, partialField);
}

export function getValue<T>(value: T | Field<T> | Readable<Field<T>>): T {
  const isStore = function (v: T | Field<T> | Readable<Field<T>>): v is Readable<Field<T>> {
    return (value as Readable<Field<T>>).subscribe !== undefined;
  };

  const isField = function (v: T | Field<T> | Readable<Field<T>>): v is Field<T> {
    return !!(value as Field<T>).name && (value as Field<T>).valid !== undefined;
  };

  if (isStore(value)) {
    return get(value).value;
  } else if (isField(value)) {
    return value.value;
  }

  return value;
}

export async function getErrors<T>(
  value: T | Field<T> | Readable<Field<T>>,
  validators: Validator[],
  stopAtFirstError = false,
  isOptional = false
) {
  const v = getValue(value);

  if (isOptional && !v) {
    return [];
  }

  let errors: FieldValidation[] = [];

  for (const validator of validators) {
    let result = validator(v);

    if (result && (<Promise<FieldValidation>>result).then !== undefined) {
      result = await result;
    }

    if (stopAtFirstError && !(result as FieldValidation).valid) {
      errors = [result as FieldValidation];
      break;
    }

    errors = [...errors, result as FieldValidation];
  }

  return errors;
}

export function processField<T>(
  field: Field<T>,
  validations?: FieldValidation[],
  partialField: Partial<Field<T>> = {}
) {
  if (validations) {
    const errors = validations.filter((v) => !v.valid).map((v) => v.name);
    const valid = !errors.length;
    return { ...field, valid: valid, invalid: !valid, errors, ...partialField };
    // return { ...field, dirty: field.dirty || !!validations.length, valid, invalid: !valid, errors, ...partialField };
  }

  return field;
}

export function createFieldStore<T>(
  name: string,
  v: T,
  validators: Validator[] = [],
  options: FieldOptions
): Omit<Writable<Field<T>>, 'set'> & {
  validate: () => Promise<Field<T>>;
  reset: () => void;
  clear: () => void;
  set(this: void, value: Field<T> | T): void;
} {
  const value = {
    name,
    value: v,
    valid: options.valid,
    invalid: !options.valid,
    dirty: false,
    errors: []
  };
  const store = writable<Field<T>>(value);
  const { subscribe, update, set: _set } = store;

  async function set(this: void, field: Field<T> | T, forceValidation: boolean = false) {
    if (!isField(field)) {
      field = processField(get(store), [], { value: field });
    }

    if (forceValidation || options.validateOnChange) {
      const validations = await getErrors(
        field,
        validators,
        options.stopAtFirstError,
        options.isOptional
      );
      _set(processField(field, validations, { dirty: true }));
    } else {
      _set(processField(field, undefined, { dirty: true }));
    }
  }

  async function validate() {
    const errors = await getErrors(store, validators, options.stopAtFirstError, options.isOptional);
    let obj: Field<T> = {} as Field<T>;

    update((field) => {
      obj = processField(field, errors, { dirty: false });
      return obj;
    });

    return obj;
  }

  function reset() {
    _set(
      processField({
        dirty: false,
        errors: [],
        name,
        valid: options.valid,
        invalid: !options.valid,
        value: v
      })
    );
  }

  if (options.checkOnInit) {
    set(value);
  }

  function clear() {
    _set(
      processField({
        dirty: false,
        errors: [],
        name,
        valid: options.valid,
        invalid: !options.valid,
        value: null as T
      })
    );
  }

  return { subscribe, update, set, validate, reset, clear };
}
