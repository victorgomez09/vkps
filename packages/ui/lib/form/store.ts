import { writable } from "svelte/store";
import { Form, FormControlsUnspecified } from "./models";

export type FormReference = {
  form: Form<any> & FormControlsUnspecified;
  node: HTMLFormElement;
  notifyListeners: Function;
};

export const formReferences = writable<FormReference[]>([]);