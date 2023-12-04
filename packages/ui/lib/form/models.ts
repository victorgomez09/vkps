export class Form<Keys extends keyof any> {
    /**
     * Function for creating a Form
     * @remarks This allows us to specify the index signatures in the class
     */
    static create<Keys extends keyof any>(
        initialData: FormProperties,
        notifyListeners: Function
    ) {
        return new Form<Keys>(initialData, notifyListeners) as Form<Keys> &
            FormControlsSpecified<Keys> &
            FormControlsUnspecified;
    }
    private readonly _notifyListeners: Function;

    get valid(): boolean {
        let valid = true;
        this.forEachControl((formControl) => {
            if (!formControl.valid) valid = false;
        });
        return valid;
    }

    get touched(): boolean {
        let touched = true;
        this.forEachControl((formControl) => {
            if (!formControl.touched) touched = false;
        });
        return touched;
    }

    get values(): FormValues<Keys> {
        let values = {} as any;
        this.forEachControl((formControl, key) => {
            values[key] = formControl.value;
        });

        return values;
    }

    set touched(value: boolean) {
        this.forEachControl((formControl) => {
            formControl.touched = value;
        });

        this._notifyListeners();
    }

    private constructor(initialData: FormProperties, notifyListeners: Function) {
        for (const [k, v] of Object.entries(initialData)) {
            this._addControl(k, v.initial, v.validators, [], v.errorMap);
        }

        this._notifyListeners = notifyListeners;
    }

    /** Reset the whole form */
    reset() {
        this.forEachControl((formControl) => formControl.reset());
    }

    /** @internal Add a form conrol to the Form */
    _addControl(
        name: string,
        initial: string = "",
        validators: Validator[] = [],
        elements: FormControlElement[] = [],
        errorMap: ErrorMap = {}
    ) {
        (this as any)[name] = new FormControl({
            value: initial,
            validators: validators,
            elements: elements,
            errorMap: errorMap,
            formRef: () => this,
        });
    }

    private forEachControl(
        callback: (formControl: FormControl, key: string) => void
    ) {
        for (const [key, value] of Object.entries(this)) {
            if (value instanceof FormControl) {
                callback(value, key);
            }
        }
    }
}

export class FormControlMissingError extends Error { }

// We do not use utility types here, since they would hide the name of the type
export type FormControlsUnspecified = {
    [key: string]: FormControl | undefined;
};

export type FormControlsSpecified<Keys extends keyof any> = {
    [K in Keys]: FormControl;
};

export type FormValues<Keys extends keyof any> = Partial<
    Record<string, string>
> &
    Record<Keys, string>;

/** A FormControl represents the state of a {@link FormControlElement} like (input, textarea...) */
export class FormControl {
    validators: Validator[];

    /**
     * Returns an object containing possible validation errors
     * @example
     * (All validators are throwing an error)
     * `{ required: true, minLength: 4, maxLength: 20 }`
     * (Only required is invalid)
     * `{ required: true }`
     */
    errors: ValidationErrors = {};

    /**
     * Contains a map of values, that will be shown
     * in place of the original validation error.
     */
    errorMap: ErrorMap = {};

    /**
     * The DOM elements representing this control
     */
    elements: FormControlElement[] = [];

    /** Does the FormControl pass all given validators? */
    valid = true;

    /**
     * If the FormControl has been interacted with.
     * (triggered by blur event)
     */
    _touched = false;

    /** The initial value of the FormControl. Defaults to `""` if not set via `useForm(params)`. */
    initial: string;

    // TODO can we get the Form via Svelte context?
    private readonly formRef: () => Form<any>;

    private _value: string = "";

    get value() {
        return this._value;
    }

    get touched() {
        return this._touched;
    }

    /**
     * This will only change the internal value of the control, not the one displayed in the actual HTML-Element
     *
     * See `change(value: String)` for doing both
     */
    set value(value: string) {
        this._value = value;
        this.validate();
    }

    set touched(value: boolean) {
        this._touched = value;
        this.elements.forEach((element) => {
            if (value) element.classList.add("touched");
            else element.classList.remove("touched");
        });
    }

    constructor(formControl: {
        value: string;
        validators: Validator[];
        errorMap: ErrorMap;
        elements: FormControlElement[];
        formRef: () => Form<any>;
    }) {
        this.formRef = formControl.formRef;
        this.validators = formControl.validators;
        this.errorMap = formControl.errorMap;
        this.initial = formControl.value;
        this.elements = formControl.elements;
        this.value = formControl.value;
    }

    /**
     * Set an error manually.
     *
     * The error will be removed after changes to the value or on validate()
     *
     * Used for setting an error that would be difficult to implement with a validator.
     * @example Backend Response returning Login failed
     * ``` typescript
     * function submit() {
     *    apiLogin($form.values).then(response => {})
     *    .catch(error => {
     *        if (error.status === 403) {
     *            $form.password.error({ login: "Password or username is incorrect" });
     *        }
     *    })
     * }
     * ```
     */
    error(errors: ValidationErrors) {
        this.errors = { ...errors, ...this.errors };
        this.valid = false;

        // Update the $form
        this.formRef()["_notifyListeners"]();
    }

    /** Change the value and the value of all HTML-Elements associated with this control */
    change(value: any) {
        this.value = value;
        this.elements.forEach((element) => (element.value = value));

        // Update the $form
        this.formRef()["_notifyListeners"]();
    }

    /** Validate the FormControl by querying through the given validators. */
    validate() {
        let valid = true;
        this.errors = {};

        for (const validator of this.validators) {
            const errors = validator(this.value, this.formRef() as any, this);
            if (!errors) continue;

            valid = false;
            for (const error of Object.entries(errors)) {
                let [key, value] = error;

                // If there is a map for the error, use it
                const errorMapping = this.errorMap[key];
                if (errorMapping) {
                    value =
                        typeof errorMapping === "function"
                            ? errorMapping(value)
                            : errorMapping;
                }

                this.errors[key] = value;
            }
        }

        this.valid = valid;
        this.elements.forEach((element) =>
            element.setCustomValidity(valid ? "" : "Field is invalid")
        );

        return valid;
    }

    /** Reset the form control value to its initial value or `{ value }` and untouch it */
    reset({ value }: { value?: string | null } = {}) {
        const resetValue = value == null ? this.initial : value;
        this.elements.forEach((element) => (element.value = resetValue));
        this.value = resetValue;
        this.touched = false;

        // Updating the $form
        this.formRef()["_notifyListeners"]();
    }
}

export function isTextElement(node: any): node is TextElement {
    return (
        node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement
    );
}

export function isFormControlElement(node: any): node is FormControlElement {
    return (
        node instanceof HTMLInputElement ||
        node instanceof HTMLTextAreaElement ||
        node instanceof HTMLSelectElement
    );
}

/* This function checks the node if it has an attribute `data-suf-ignore`
  It's used to ignore elements that should not be part of the form
*/
export function isIgnoredElement(node: any): boolean {
    return (
        (node.hasAttribute("data-suf-ignore") &&
            node.getAttribute("data-suf-ignore") === "true") || // <div data-suf-ignore="true">
        node.getAttribute("data-suf-ignore") === true // <div data-suf-ignore> or <div data-suf-ignore={true}>
    );
}

export type TextElement = HTMLInputElement | HTMLTextAreaElement;
export type FormControlElement = TextElement | HTMLSelectElement;

export type FormProperties = {
    [key: string]: {
        /** Initial value of the form control */
        initial?: string;
        /** The validators that will be checked when the input changes */
        validators?: Validator[];
        /**
         * The map through which validation errors will be mapped.
         * You can either pass a string or a function returning a new error value
         *
         * **Think of it as a translation map. 😆**
         */
        errorMap?: ErrorMap;
    };
};

/**
 * A function that depending on the control's validity either returns:
 * - `null | undefined` when **valid**
 * - {@link ValidationErrors} when **invalid**.
 */
export type Validator = (
    /** The value of the control. */
    value: string,
    /** The containing form. */
    form: Form<any> & FormControlsUnspecified,
    /** The control this validator was assigned to. */
    control: FormControl
) => ValidationErrors | (null | undefined);

/** An object that contains errors thrown by the validator. */
export type ValidationErrors = { [errorName: string]: any };

export type ErrorMap = { [errorName: string]: string | ((error: any) => any) };