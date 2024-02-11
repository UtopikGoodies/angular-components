import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractFormField,
  FormField,
  FormFieldArray,
  FormfieldObject as FormFieldObject,
  FormfieldObject,
} from './models';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormControlStatus,
  FormGroup,
  ValidatorFn,
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
import { distinctValidator } from './validators';
import { FormControlErrorMessage } from './form-field-error';
import { MatListModule } from '@angular/material/list';

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
    MatListModule,
  ],
  template: `
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
      @if(buttonDelete) {
      <button mat-raised-button color="accent" (click)="delete()">
        Delete
      </button>
      }
    @if(formGroup){
      <button
        mat-raised-button
        color="primary"
        [disabled]="!formGroup.valid"
        (click)="submit()"
      >
        {{ buttonActionText }}
      </button>
    }
    </dyn-form-actions>
  `,
  styleUrls: ['form.scss'],
  host: { class: 'dyn-mdc-form' },
  encapsulation: ViewEncapsulation.None,
})
export class DynamicForm implements OnInit {
  @Input() dynFormFields!: AbstractFormField[];
  @Input() buttonDelete: boolean = false;
  @Input() buttonActionText: string = 'Create';
  @Output() formStatusChanges = new EventEmitter<FormControlStatus>();
  @Output() formValueChanges = new EventEmitter<object>();
  @Output() deleteValue = new EventEmitter();
  @Output() submitValue = new EventEmitter<object>();

  formGroup!: FormGroup<object>;

  ngOnInit(): void {
    this.formGroup = this.generateFormGroup(this.dynFormFields);
    this.formGroup.valueChanges.subscribe({
      next: (value) => this.formValueChanges.emit(value),
      error: (err) => console.error(err),
    });
    this.formGroup.statusChanges.subscribe({
      next: (value) => this.formStatusChanges.emit(value),
      error: (err) => console.error(err),
    });
  }
  

  // ngAfterViewInit(): void {
  //   // this.formGroup = this.generateFormGroup(this.dynFormFields);

  //   this.formGroup.valueChanges.subscribe({
  //     next: (value) => this.formValueChanges.emit(value),
  //     error: (err) => console.error(err),
  //   });
  //   this.formGroup.statusChanges.subscribe({
  //     next: (value) => this.formStatusChanges.emit(value),
  //     error: (err) => console.error(err),
  //   });
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['dynFormFields']) {
  //     this.formGroup = this.generateFormGroup(this.dynFormFields);
  //     console.debug();
  //   }
  // }

  generateFormGroup(formFields: AbstractFormField[]): FormGroup {
    const formGroup = new FormGroup({});

    formFields.forEach((formField) => {
      switch (formField.formFieldType) {
        case 'FormFieldArray':
          const formFieldArray = formField as FormFieldArray;

          formGroup.addControl(
            formFieldArray.name,
            this.generateFormArray(formFieldArray)
          );

          break;

        case 'FormfieldObject':
          const FormFieldObject = formField as FormfieldObject;

          formGroup.addControl(
            FormFieldObject.name,
            this.generateFormGroup(FormFieldObject.formFields)
          );

          break;

        default:
          const formFieldControl = formField as FormField<unknown>;
          formGroup.addControl(
            formFieldControl.name,
            this.generateFormControl(formFieldControl)
          );

          break;
      }
    });

    return formGroup;
  }

  generateFormArray(
    formFieldArray: FormFieldArray
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
          formArray.push(this.generateFormArray(formField as FormFieldArray));
          break;

        case 'FormfieldObject':
          formArray.push(
            this.generateFormGroup((formField as FormfieldObject).formFields)
          );
          break;

        default:
          formArray.push(
            this.generateFormControl(formField as FormField<unknown>)
          );
          break;
      }
    });

    return formArray;
  }

  generateFormControl<T>(formField: FormField<T>): FormControl {
    let validators: ValidatorFn[] = [];

    if (formField.required) {
      validators.push(Validators.required);
    }

    return new FormControl(formField.value, validators);
  }

  delete() {
    this.deleteValue.emit();
  }

  submit() {
    this.submitValue.emit(this.formGroup.value);
  }
}
