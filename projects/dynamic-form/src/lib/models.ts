
export abstract class AbstractFormField {
  abstract formFieldType: string;
  name!: string;
  title!: string;
  required: boolean = false;
}

export abstract class FormField<T> extends AbstractFormField {
  hidden: boolean = false;
  hint: string = '';
  icon: string = '';
  placeholder: string = '';
  value!: T
}

export class FormFieldArray extends AbstractFormField {
  formFieldType = 'FormFieldArray';
  subtitle!: string;
  formField!: AbstractFormField;
  uniqueValue: boolean = false;

  constructor(data: {
    name: string;
    title: string;
    subtitle?: string;
    formField: AbstractFormField;
    uniqueValue?: boolean;
  }) {
    super();
    Object.assign(this, data);
  }
}

export class FormFieldInput<T = string> extends FormField<T> {
  formFieldType = 'FormFieldInput';
  type: string = 'text';

  constructor(data: {
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
  formFieldType = 'FormfieldObject';
  subtitle!: string;
  formFields!: FormField<unknown>[];

  constructor(data: {
    name: string;
    title: string;
    subtitle?: string;
    formFields: FormField<unknown>[];
    required?: boolean;
  }) {
    super();
    Object.assign(this, data);
  }
}

export interface Option {
  value: string;
  viewValue: string;
}

export interface FormFieldSelectOptionGroup {
  disabled?: boolean;
  name: string;
  options: Option[];
}

export class FormFieldSelect<T = string> extends FormField<T> {
  formFieldType = 'FormFieldSelect';
  options?: Option[];
  optionGroups?: FormFieldSelectOptionGroup[];
  optionNone?: boolean = true;

  constructor(data: {
    hint?: string;
    icon?: string;
    name: string;
    options?: Option[]; // Ignored if optionGroups is set
    optionGroups?: FormFieldSelectOptionGroup[];
    placeholder?: string;
    required?: boolean;
    hidden?: boolean;
    optionNone?: boolean;
    title?: string;
    value?: T;
  }) {
    super();
    Object.assign(this, data);
  }
}