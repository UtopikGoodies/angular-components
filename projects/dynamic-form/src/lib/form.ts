/* eslint-disable prettier/prettier */

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractFormField,
  FormField,
  FormFieldArray,
  FormfieldObject as FormFieldObject,
} from './models';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DynamicFormFieldArray,
  DynamicFormFieldObject,
  DynamicFormfield,
} from './form-field';
import { DynamicFormActions } from './form-actions';
import { MatButtonModule } from '@angular/material/button';
import {
  distinctValuesValidator,
  duplicateValueValidatorInArray,
} from './validators';

@Component({
  selector: 'dyn-form',
  standalone: true,
  imports: [
    DynamicFormActions,
    DynamicFormfield,
    DynamicFormFieldArray,
    DynamicFormFieldObject,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  template: `
    @if(formGroup){
    <form [formGroup]="formGroup">
      @for (formField of dynFormFields; track formField) {
      <div class="form-row">
        @switch (formField.formFieldType) { @case ('FormFieldArray') {
        <dyn-form-field-array
          [dynFormField]="formField"
          [dynFormGroup]="formGroup.get(formField.name)"
        ></dyn-form-field-array>
        } @case ('FormfieldObject') {
        <dyn-form-field-object
          [dynFormField]="formField"
          [dynFormGroup]="formGroup.get(formField.name)"
        ></dyn-form-field-object>
        } @default {
        <dyn-form-field
          [dynFormField]="formField"
          [dynFormControl]="formGroup.get(formField.name)"
        ></dyn-form-field>
        } }
      </div>
      }
    </form>
    <dyn-form-actions actionPosition="end">
      <button
        mat-raised-button
        color="primary"
        [disabled]="formGroup.status === 'INVALID'"
        (click)="submit()"
      >
        {{ buttonActionText }}
      </button>
    </dyn-form-actions>
    }
  `,
  styleUrls: ['form.scss'],
  host: { class: 'dyn-mdc-form' },
  encapsulation: ViewEncapsulation.None,
})
export class DynamicForm implements AfterViewInit {
  @Input() dynFormFields!: AbstractFormField[];
  @Input() buttonActionText: string = 'Create';
  // @Output() formStatusChanges = new EventEmitter<FormControlStatus>();
  // @Output() formValueChanges = new EventEmitter<object>();
  @Output() submitValue = new EventEmitter<object>();

  formGroup!: FormGroup<object>;

  constructor(private fb: FormBuilder) {
    console.debug(this.formGroup);
  }

  ngAfterViewInit(): void {
    this.formGroup = this.generateFormGroup(this.dynFormFields);
    console.debug(this.formGroup);

    // this.formGroup = this.toFormGroup(this.dynFormFields);
    // this.formGroup.valueChanges.subscribe({
    //   next: (value) => this.formValueChanges.emit(value),
    //   error: (err) => console.error(err),
    //   complete: () => console.log('Value change complete.'),
    // });
    // this.formGroup.statusChanges.subscribe({
    //   next: (value) => this.formStatusChanges.emit(value),
    //   error: (err) => console.error(err),
    //   complete: () => '',
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dynFormFields']) {
      this.formGroup = this.generateFormGroup(this.dynFormFields);
      console.debug(this.formGroup);
    }
  }

  generateFormGroup(formFields: AbstractFormField[]): FormGroup {
    const formGroup = this.fb.group({});

    formFields.forEach((formField) => {
      switch (formField.formFieldType) {
        case 'FormfieldObject':
          formGroup.addControl(
            formField.name,
            this.generateFormGroup((formField as FormFieldObject).formFields)
          );
          break;

        case 'FormFieldArray':
          const formFieldArray = formField as FormFieldArray;
          let newFormGroup = this.fb.group({});

          if (
            formFieldArray.formFieldModel.formFieldType == 'FormfieldObject'
          ) {
            const controls = this.generateFormGroup(
              (formField as FormFieldObject).formFields
            ).controls;
            Object.keys(controls).forEach((key) => {
              newFormGroup.addControl(key, controls[key]);
            });
          } else {
            newFormGroup = this.generateFormGroup(formFieldArray.formFields);
          }

          const validators = formFieldArray.distinct
            ? [distinctValuesValidator()]
            : [];
          formGroup.addControl(
            formField.name,
            this.fb.array([newFormGroup], validators)
          );
          break;

        default:
          // const formControl = new FormControl(
          //   (formField as FormField<unknown>).value
          // );
          // if (formField.required) {
          //   formControl.addValidators(Validators.required);
          // }
          formGroup.addControl(
            formField.name,
            this.generateFormControl(formField)
          );
          break;
      }
    });

    return formGroup;
  }

  generateFormControl(formField: AbstractFormField): FormControl {
    const formControl = new FormControl(
      (formField as FormField<unknown>).value
    );
    if (formField.required) {
      formControl.addValidators(Validators.required);
    }
    return formControl;
  }

  // generateFormControls(formFields: AbstractFormField[]): FormGroup<object> {
  //   // const formGroup = new FormGroup({});
  //   const formGroup = this.fb.group({});

  //   formFields.forEach((formField) => {
  //     switch (formField.formFieldType) {
  //       case 'FormfieldObject':
  //         formGroup.addControl(
  //           formField.name,
  //           this.generateFormControls((formField as FormfieldObject).formFields)
  //         );
  //         break;

  //       case 'FormFieldArray':
  //         formGroup.addControl(
  //           formField.name,
  //           this.toFormArray(formField as FormFieldArray)
  //         );
  //         break;

  //       default:
  //         formGroup.addControl(
  //           formField.name,
  //           this.toFormControl(formField as FormField<unknown>)
  //         );
  //         break;
  //     }
  //   });

  //   return formGroup;
  // }

  // toFormArray(formFieldArray: FormFieldArray): FormArray {
  //   const validators = formFieldArray.distinct
  //     ? [distinctValuesValidator()]
  //     : [];
  //   const formGroup = this.fb.array([], validators);

  //   formFieldArray.formFields.forEach((formField) => {
  //     switch (formField.formFieldType) {
  //       case 'FormfieldObject':
  //         formGroup.push(
  //           new FormControl(
  //             formField.name,
  //             this.generateFormControls(
  //               (formField as FormfieldObject).formFields
  //             )
  //           )
  //         );
  //         break;

  //       case 'FormFieldArray':
  //         formGroup.push(
  //           new FormControl(
  //             formField.name,
  //             this.generateFormControls(
  //               (formField as FormFieldArray).formFields
  //             )
  //           )
  //         );
  //         break;

  //       default:
  //         formGroup.push(
  //           new FormControl(
  //             formField.name,
  //             this.toFormControl(formField as FormField<unknown>)
  //           )
  //         );
  //         break;
  //     }
  //   });

  //   return formGroup;
  // }

  // toFormControl(formField: FormField<unknown>): FormControl {
  //   const formControl = new FormControl(formField.value);

  //   if (formField.required) {
  //     formControl.addValidators(Validators.required);
  //   }

  //   return formControl;
  // }

  // onReceivedStatusChanges(status: FormControlStatus) {
  //   // this.formStatus = status;
  //   this.formStatusChanges.emit(status);
  // }

  // onReceivedValueChanges(value: object) {
  //   // this.formValue = value;
  //   this.formValueChanges.emit(value);
  // }

  submit() {
    this.submitValue.emit(this.formGroup.value);
    this.formGroup.reset();
  }
}
