import type { Readable } from 'svelte/store';

export type FieldOptions = {
  valid: boolean;
  checkOnInit: boolean;
  validateOnChange: boolean;
  stopAtFirstError: boolean;
  isOptional: boolean;
};

export type Field<T> = {
  name: string;
  value: T;
  valid: boolean;
  invalid: boolean;
  dirty: boolean;
  errors: string[];
};

export const defaultFieldOptions: FieldOptions = {
  valid: true,
  checkOnInit: false,
  validateOnChange: true,
  stopAtFirstError: false,
  isOptional: false
};

export type FieldsValues<T> = T extends Readable<infer U>
  ? U
  : {
      [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
    };

export type Fields =
  | Readable<unknown>
  | [Readable<unknown>, ...Array<Readable<unknown>>]
  | Array<Readable<unknown>>;

export type Form = {
  valid: boolean;
  dirty: boolean;
  errors: string[];
};

export function isField<T>(field: unknown): field is Field<T> {
  const keys = Object.keys(field!);
  return ['name', 'value', 'valid', 'invalid', 'errors'].every((key) => keys.includes(key));
}

export type FieldValidation = { valid: boolean; name: string };
export type Validator = (value: unknown) => FieldValidation | Promise<FieldValidation>;
