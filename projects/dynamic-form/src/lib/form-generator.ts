import { FormGroup, FormArray, AbstractControl, ValidatorFn, FormControl, Validators } from "@angular/forms";
import { AbstractFormField, FormFieldArray, FormfieldObject, FormField } from "./models";
import { distinctValidator } from "./validators";

export class FormGenerator {
  static generateFormGroup(formFields: AbstractFormField[], noValue = false): FormGroup {
    const formGroup = new FormGroup({});

    if (!formFields) {
      return formGroup;
    }

    formFields.forEach((formField) => {
      switch (formField.formFieldType) {
        case 'FormFieldArray':
          const formFieldArray = formField as FormFieldArray;

          formGroup.addControl(
            formFieldArray.name,
            FormGenerator.generateFormArray(formFieldArray, noValue)
          );

          break;

        case 'FormfieldObject':
          const FormFieldObject = formField as FormfieldObject;

          formGroup.addControl(
            FormFieldObject.name,
            FormGenerator.generateFormGroup(FormFieldObject.formFields, noValue)
          );

          break;

        default:
          const formFieldControl = formField as FormField<unknown>;
          formGroup.addControl(
            formFieldControl.name,
            FormGenerator.generateFormControl(formFieldControl, noValue)
          );

          break;
      }
    });

    return formGroup;
  }

  static generateFormArray(
    formFieldArray: FormFieldArray, noValue = false
  ): FormArray<AbstractControl> {
    const formArray = new FormArray<AbstractControl>([]);

    let validators: ValidatorFn[] = [];
    if (formFieldArray.distinct) {
      validators.push(distinctValidator());
    }
    formArray.addValidators(validators);

    formFieldArray.formFields.forEach((formField) => {
      switch (formField.formFieldType) {
        case 'FormFieldArray':
          formArray.push(FormGenerator.generateFormArray(formField as FormFieldArray));
          break;

        case 'FormfieldObject':
          formArray.push(
            FormGenerator.generateFormGroup((formField as FormfieldObject).formFields)
          );
          break;

        default:
          formArray.push(FormGenerator.generateFormControl(formField as FormField<unknown>));
          break;
      }
    });

    return formArray;
  }

  static generateFormControl<T>(formField: FormField<T>, noValue = false): FormControl {
    let validators: ValidatorFn[] = [];

    if (formField.required) {
      validators.push(Validators.required);
    }

    return new FormControl({ value: noValue ? null : formField.value, disabled: formField.disabled }, validators);
  }
}
