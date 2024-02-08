import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractFormField,
  FormField,
  FormFieldArray,
  FormfieldObject,
} from './models';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormControlStatus,
  FormGroup,
  Validators,
} from '@angular/forms';
import { duplicateValueValidatorInArray } from './validators';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DynamicFormFieldArray,
  DynamicFormFieldObject,
  DynamicFormfield,
} from './form-field';
import { DynamicFormActions } from './form-actions';
import { MatButtonModule } from '@angular/material/button';

// @Component({
//   selector: 'dyn-form-content',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     DynamicFormFieldArrayComponent,
//     DynamicFormFieldObjectComponent,
//     DynamicFormfieldComponent,
//   ],
//   template: `
//     <form [formGroup]="formGroup">
//       @for (formField of dynFormFields; track formField) {
//       <div class="form-row">
//         @switch (formField.formFieldType) { @case ('FormFieldArray') {
//         <dyn-form-field-array
//           [dynFormField]="formField"
//           [dynFormGroup]="formGroup.get(formField.name)"
//         ></dyn-form-field-array>
//         } @case ('FormfieldObject') {
//         <dyn-form-field-object
//           [dynFormField]="formField"
//           [dynFormGroup]="formGroup.get(formField.name)"
//         ></dyn-form-field-object>
//         } @default {
//         <dyn-form-field
//           [dynFormField]="formField"
//           [dynFormControl]="formGroup.get(formField.name)"
//         ></dyn-form-field>
//         } }
//       </div>
//       }
//     </form>
//   `,
//   exportAs: 'dynForm',
// })
// export class DynamicFormContent implements OnInit {
//   @Input() dynFormFields!: AbstractFormField[];
//   @Output() formStatusChanges = new EventEmitter<FormControlStatus>();
//   @Output() formValueChanges = new EventEmitter<object>();

//   formGroup!: FormGroup<object>;

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {
//     this.formGroup = this.toFormGroup(this.dynFormFields);
//     this.formGroup.valueChanges.subscribe({
//       next: (value) => this.formValueChanges.emit(value),
//       error: (err) => console.error(err),
//       complete: () => console.log('Value change complete.'),
//     });
//     this.formGroup.statusChanges.subscribe({
//       next: (value) => this.formStatusChanges.emit(value),
//       error: (err) => console.error(err),
//       complete: () => '',
//     });
//   }

//   toFormGroup(formFields: AbstractFormField[]): FormGroup<object> {
//     const formGroup = this.fb.group({});

//     formFields.forEach((formField) => {
//       if (formField.formFieldType == 'FormFieldArray') {
//         const formFieldArray = formField as FormFieldArray;
//         formGroup.addControl(formFieldArray.name, this.fb.array([]));

//         let formControl;

//         if (formFieldArray.formField.formFieldType == 'FormfieldObject') {
//           const formFieldObject = formFieldArray.formField as FormfieldObject;
//           formControl = this.toFormGroup(formFieldObject.formFields);
//         } else {
//           formControl = this.toFormControl(
//             formFieldArray.formField as FormField<unknown>
//           );
//           if (formFieldArray.uniqueValue) {
//             formControl.addValidators(duplicateValueValidatorInArray());
//           }
//         }

//         (formGroup.get(formFieldArray.name) as FormArray).push(formControl);
//       } else if (formField.formFieldType == 'FormfieldObject') {
//         const formFieldObject = formField as FormfieldObject;
//         formGroup.addControl(
//           formFieldObject.name,
//           this.toFormGroup(formFieldObject.formFields)
//         );
//       } else {
//         formGroup.addControl(
//           formField.name,
//           this.toFormControl(formField as FormField<unknown>)
//         );
//       }
//     });

//     return formGroup;
//   }

//   toFormControl(formField: FormField<unknown>): FormControl {
//     if (formField.required) {
//       return new FormControl(formField.value, Validators.required);
//     } else {
//       return new FormControl(formField.value);
//     }
//   }
// }

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
  template: ` <form [formGroup]="formGroup">
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
    </dyn-form-actions>`,
  styleUrls: ['form.scss'],
  host: { class: 'dyn-mdc-form' },
  encapsulation: ViewEncapsulation.None,
})
export class DynamicForm implements OnInit {
  @Input() dynFormFields!: AbstractFormField[];
  @Input() buttonActionText: string = 'Create';
  // @Output() formStatusChanges = new EventEmitter<FormControlStatus>();
  // @Output() formValueChanges = new EventEmitter<object>();
  @Output() submitValue = new EventEmitter<object>();

  formGroup!: FormGroup<object>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.toFormGroup(this.dynFormFields);
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

  toFormGroup(formFields: AbstractFormField[]): FormGroup<object> {
    const formGroup = this.fb.group({});

    formFields.forEach((formField) => {
      if (formField.formFieldType == 'FormFieldArray') {
        const formFieldArray = formField as FormFieldArray;
        formGroup.addControl(formFieldArray.name, this.fb.array([]));

        let formControl;

        if (formFieldArray.formField.formFieldType == 'FormfieldObject') {
          const formFieldObject = formFieldArray.formField as FormfieldObject;
          formControl = this.toFormGroup(formFieldObject.formFields);
        } else {
          formControl = this.toFormControl(
            formFieldArray.formField as FormField<unknown>
          );
          if (formFieldArray.uniqueValue) {
            formControl.addValidators(duplicateValueValidatorInArray());
          }
        }

        (formGroup.get(formFieldArray.name) as FormArray).push(formControl);
      } else if (formField.formFieldType == 'FormfieldObject') {
        const formFieldObject = formField as FormfieldObject;
        formGroup.addControl(
          formFieldObject.name,
          this.toFormGroup(formFieldObject.formFields)
        );
      } else {
        formGroup.addControl(
          formField.name,
          this.toFormControl(formField as FormField<unknown>)
        );
      }
    });

    return formGroup;
  }

  toFormControl(formField: FormField<unknown>): FormControl {
    if (formField.required) {
      return new FormControl(formField.value, Validators.required);
    } else {
      return new FormControl(formField.value);
    }
  }

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
