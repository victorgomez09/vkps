import type { Validator } from '../types';

export function url(): Validator {
  const regex =
    /(https?|ftp|git|svn):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
  return (value: string) => ({ valid: regex.test(value), name: 'url' });
}
