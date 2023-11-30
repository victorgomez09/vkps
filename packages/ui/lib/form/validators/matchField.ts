import type { Readable } from 'svelte/store';
import { get } from 'svelte/store';
import type { Field } from '../types';

export function matchField(store: Readable<Field<any>>) {
  return (value) => {
    return { valid: get(store).value === value, name: 'match_field' };
  };
}
