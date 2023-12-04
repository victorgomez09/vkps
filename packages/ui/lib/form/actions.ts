import { tick } from "svelte";
import { get } from "svelte/store";
import { FormControl, FormControlElement, Validator } from "./models";
import { formReferences, type FormReference } from "./store";

/**
 * Add validators to form control
 * @example
 * ``` svelte
 * <input name="nameOfInput" use:validators={[required, minLength(5), maxLength(20)]} />
 * ```
 */
export function validators(
  element: FormControlElement,
  validators: Validator[]
) {
  let formControl: FormControl | undefined;
  let formReference: FormReference | undefined;

  setupValidators();

  return {
    update: updateValidators,
  };

  async function setupValidators() {
    const formElement = element.form;
    if (!formElement)
      throw new ValidatorsActionError(
        "HTML element doesn't have an ancestral form"
      );

    await tick();
    const possibleFormReference = get(formReferences).find(
      (form) => form.node === formElement
    );

    if (!possibleFormReference)
      throw new ValidatorsActionError(
        "HTML form doesn't have a svelte-use-form binded. (use:form)"
      );

    formReference = possibleFormReference;

    let possibleFormControl = formReference.form[element.name];
    if (!(possibleFormControl instanceof FormControl))
      throw new ValidatorsActionError(
        `Form Control [${element.name}] doesn't exist.`
      );

    formControl = possibleFormControl;
    formControl.validators.push(...validators);
    formControl.validate();
    formReference.notifyListeners();
  }

  function updateValidators(updatedValidators: Validator[]) {
    if (!formControl || !formReference) return;

    // Get the static validators (The validators set via useForm({...}))
    const newValidators = formControl.validators.filter(
      (validator) => !validators.find((v) => v === validator)
    );

    // Add the new validators to it
    newValidators.push(...updatedValidators);

    formControl.validators = newValidators;
    formControl.validate();
    formReference.notifyListeners();
  }
}

export class ValidatorsActionError extends Error {}