export abstract class AbstractFormField {
  abstract formFieldType: string;
  disabled: boolean = false;
  name!: string;
  required: boolean = false;
  title!: string;
}

export abstract class FormField<T> extends AbstractFormField {
  hidden: boolean = false;
  hint: string = '';
  icon: string = '';
  placeholder: string = '';
  value!: T;
}

export type FormFieldValue = {
  formfieldName: string;
  formfieldValue: string;
};

export class FormFieldArray extends AbstractFormField {
  distinct: boolean = false;
  formFields!: AbstractFormField[];
  formFieldType = 'FormFieldArray';
  subtitle!: string;

  constructor(data: {
    disabled?: boolean;
    distinct?: boolean;
    formFields: AbstractFormField[];
    name: string;
    subtitle?: string;
    title: string;
  }) {
    super();
    Object.assign(this, data);
  }
}

export class FormfieldLabel<T> extends FormField<T> {
  formFieldType = 'FormfieldLabel';
  constructor(data: {
    disabled?: boolean;
    hidden?: boolean;
    name: string;
    title: string;
    value: T;
  }) {
    super();
    Object.assign(this, data);
  }
}

export class FormFieldInput<T = string> extends FormField<T> {
  formFieldType = 'FormFieldInput';
  type: string = 'text';

  constructor(data: {
    disabled?: boolean;
    hidden?: boolean;
    hint?: string;
    icon?: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    title: string;
    type?: string;
    value: T;
  }) {
    super();
    Object.assign(this, data);
  }
}

export class FormfieldObject extends AbstractFormField {
  formFields!: FormField<unknown>[];
  formFieldType = 'FormfieldObject';
  subtitle!: string;

  constructor(data: {
    formFields: FormField<unknown>[];
    name: string;
    required?: boolean;
    subtitle?: string;
    title: string;
  }) {
    super();
    Object.assign(this, data);
  }
}

export type Option<T = string> = {
  value: T;
  viewValue: string;
};

export type OptionGroup<T = string> = {
  disabled?: boolean;
  name: string;
  options: Option<T>[];
};

export class FormFieldSelect<T = string> extends FormField<T> {
  formFieldType = 'FormFieldSelect';
  optionNone: boolean = true;
  options?: Option<T>[] | OptionGroup<T>[];

  constructor(data: {
    disabled?: boolean;
    hidden?: boolean;
    hint?: string;
    icon?: string;
    name: string;
    optionNone?: boolean;
    options: Option<T>[] | OptionGroup<T>[];
    placeholder?: string;
    required?: boolean;
    title?: string;
    value?: T;
  }) {
    super();
    Object.assign(this, data);
  }
}
