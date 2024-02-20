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

export class FormFieldArray extends AbstractFormField {
  distinct: boolean = false;
  formFieldModel!: AbstractFormField;
  formFields: AbstractFormField[] = [];
  formFieldType = 'FormFieldArray';
  subtitle!: string;

  constructor(data: {
    disabled?: boolean;
    distinct?: boolean;
    formFieldModel?: AbstractFormField;
    formFields?: AbstractFormField[];
    name: string;
    subtitle?: string;
    title: string;
  }) {
    super();
    Object.assign(this, data);
    // if (this.formFields.length == 0) {
    //   this.formFields.push(this.formFieldModel);
    // }
  }
}

export class FormfieldLabel extends FormField<string> {
  formFieldType = 'FormfieldLabel';
  constructor(data: {
    disabled?: boolean;
    hidden?: boolean;
    name: string;
    title: string;
    value: string;
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

export interface Option<T = string> {
  value: T;
  viewValue: string;
}

export interface FormFieldSelectOptionGroup<T = string> {
  disabled?: boolean;
  name: string;
  options: Option<T>[];
}

export class FormFieldSelect<T = string> extends FormField<T> {
  formFieldType = 'FormFieldSelect';
  optionGroups?: FormFieldSelectOptionGroup<T>[];
  optionNone?: boolean = true;
  options?: Option<T>[];

  constructor(data: {
    disabled?: boolean;
    hidden?: boolean;
    hint?: string;
    icon?: string;
    name: string;
    optionGroups?: FormFieldSelectOptionGroup<T>[];
    optionNone?: boolean;
    options?: Option<T>[]; // Ignored if optionGroups is set
    placeholder?: string;
    required?: boolean;
    title?: string;
    value?: T;
  }) {
    super();
    Object.assign(this, data);
  }
}
