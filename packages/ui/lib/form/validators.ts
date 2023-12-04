import type { Validator } from "./models";

export const required: Validator = (value) => {
  return value.trim() ? null : { required: "Required" };
};

export function maxLength(length: number): Validator {
  return (value) => {
    if (value.trim().length > length) return { maxLength: length };
  };
}

export function minLength(length: number): Validator {
  return (value) => {
    if (value.trim().length < length) return { minLength: length };
  };
}

export const email: Validator = (value) => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      value
    )
  ) {
    return null;
  }
  return { email: {} };
};

/**
 * A variation of the `email` validator that requires a [TLD](https://en.wikipedia.org/wiki/Top-level_domain) component. Verifying
 * the validity of the TLD is not the responsibility of this validation library.
 */
export const emailWithTld: Validator = (value) => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(
      value
    )
  ) {
    return null;
  }
  return { emailWithTld: {} };
};

export const url: Validator = (value) => {
  // https://stackoverflow.com/a/5717133/13475809
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", // fragment locator
    "i"
  );
  if (pattern.test(value)) {
    return null;
  }
  return { url: "URL is not valid" };
};

export const number: Validator = (value) => {
  if (/^[0-9]+$/.test(value)) {
    return null;
  }
  return { number: {} };
};

export function pattern(regExp: string | RegExp): Validator {
  const r = typeof regExp === "string" ? new RegExp(regExp) : regExp;
  return (value) => (r.test(value) ? null : { pattern: "Pattern error" });
}