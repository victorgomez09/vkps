import type { Validator } from '../types';

export function min(n: number): Validator {
  return (value: any) => {
    const val = isNaN(value) ? value.length : parseFloat(value);
    return { valid: val >= n, name: 'min' };
  };
}
