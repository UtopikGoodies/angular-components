export abstract class AbstractFormField {
  abstract formFieldType: string;
  name!: string;
  title!: string;
  required: boolean = false;
  disabled: boolean = false;
}

export abstract class FormField<T> extends AbstractFormField {
  hidden: boolean = false;
  hint: string = '';
  icon: string = '';
  placeholder: string = '';
  value!: T;
}

export class FormFieldArray extends AbstractFormField {
  formFieldType = 'FormFieldArray';
  subtitle!: string;
  formFieldModel!: AbstractFormField;
  formFields: AbstractFormField[] = [];
  distinct: boolean = false;

  constructor(data: {
    name: string;
    title: string;
    subtitle?: string;
    formFieldModel?: AbstractFormField;
    formFields?: AbstractFormField[];
    distinct?: boolean;
  }) {
    super();
    Object.assign(this, data);
    // if (this.formFields.length == 0) {
    //   this.formFields.push(this.formFieldModel);
    // }
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
  options?: Option<T>[];
  optionGroups?: FormFieldSelectOptionGroup<T>[];
  optionNone?: boolean = true;

  constructor(data: {
    hint?: string;
    icon?: string;
    name: string;
    options?: Option<T>[]; // Ignored if optionGroups is set
    optionGroups?: FormFieldSelectOptionGroup<T>[];
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
