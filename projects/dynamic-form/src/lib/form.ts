import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractFormField,
  FormField,
  FormFieldArray,
  FormFieldInput,
  FormFieldSelect,
  FormfieldObject,
} from './models';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { duplicateValueValidatorInArray } from './validators';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

/** Error when invalid control is dirty, touched, or submitted. */
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

export class FormControlErrorMessage {
  formControl: FormControl;

  constructor(formControl: FormControl) {
    this.formControl = formControl;
  }

  getErrorMessage(): string {
    let message: string = 'Unknown error';
    if (this.formControl.hasError('required')) {
      message = 'You must enter a value';
    }

    if (this.formControl.hasError('email')) {
      message = 'Not a valid email';
    }

    if (this.formControl.hasError('duplicateValue')) {
      message = 'This value is already in use';
    }

    return message;
  }
}

@Component({
  selector: 'dyn-form',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
})
export class DynamicFormComponent {}

@Component({
  selector: 'dyn-form-field-input',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatFormFieldModule],
  template: `
    @if (!dynFormField.hidden){
    <mat-form-field class="full-width" appearance="fill">
      <mat-label [attr.for]="formField.name">{{ formField.title }}</mat-label>
      <input
        matInput
        [type]="formField.type"
        [formControl]="formControl"
        [errorStateMatcher]="matcher"
        [placeholder]="formField.placeholder"
      />
      @if (formField.icon) {
      <mat-icon matSuffix>{{ formField.icon }}</mat-icon>
      } @if (formField.hint) {
      <mat-hint>{{ formField.hint }}</mat-hint>
      } @if (formControl.invalid) {
      <mat-error>{{ formControlErrorMessage.getErrorMessage() }}</mat-error>
      }
    </mat-form-field>
    }
  `,
  styles: `
    mat-form-field {
      width: 100%;
      margin: 10px 0px 10px 0px;
    }
  `,
})
export class DynamicFormFieldInputComponent implements OnInit {
  @Input() dynFormField!: FormField<unknown>;
  @Input() dynFormControl!: AbstractControl<unknown, unknown>;

  formControl!: FormControl<unknown>;
  formControlErrorMessage!: FormControlErrorMessage;
  formField!: FormFieldInput<unknown>;
  matcher: CustomErrorStateMatcher;

  constructor() {
    this.matcher = new CustomErrorStateMatcher();
  }

  ngOnInit(): void {
    this.formControl = this.dynFormControl as FormControl<unknown>;
    this.formField = this.dynFormField as FormFieldInput<unknown>;

    this.formControlErrorMessage = new FormControlErrorMessage(
      this.formControl
    );
  }
}

@Component({
  selector: 'lib-formfield-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  template: `
    <mat-form-field class="full-width" appearance="fill">
      <mat-label [attr.for]="formField.name">{{ formField.title }}</mat-label>

      <mat-select
        [formControl]="formControl"
        [errorStateMatcher]="matcher"
        [placeholder]="formField.placeholder"
      >
        @if (formField.optionNone){
        <mat-option>-- None --</mat-option>
        } @if (formField.optionGroups){ @for (group of formField.optionGroups;
        track group) {
        <mat-optgroup [label]="group.name" [disabled]="group.disabled">
          @for (option of group.options; track option) {
          <mat-option [value]="option.value">{{ option.viewValue }}</mat-option>
          }
        </mat-optgroup>
        } } @else { @for (option of formField.options; track option) {
        <mat-option [value]="option.value">{{ option.viewValue }}</mat-option>
        } }
      </mat-select>

      @if (formField.icon) {
      <mat-icon matSuffix>{{ formField.icon }}</mat-icon>
      } @if (formField.hint) {
      <mat-hint>{{ formField.hint }}</mat-hint>
      } @if (formControl.invalid) {
      <mat-error>{{ formControlErrorMessage.getErrorMessage() }}</mat-error>
      }
    </mat-form-field>
  `,
  styles: `
  mat-form-field {
    width: 100%;
  }
  mat-form-field {
    margin: 10px 0px 10px 0px
  }
  `,
})
export class DynamicFormFieldSelectComponent implements OnInit {
  @Input() set dynFormControl(value: AbstractControl<unknown, unknown> | null) {
    this.formControl = value as FormControl<unknown>;
  }
  @Input() set dynFormField(value: FormField<unknown>) {
    this.formField = value as FormFieldSelect;
  }

  formControl!: FormControl<unknown>;
  formControlErrorMessage!: FormControlErrorMessage;
  formField!: FormFieldSelect;
  matcher!: CustomErrorStateMatcher;

  constructor() {
    this.matcher = new CustomErrorStateMatcher();
  }

  ngOnInit(): void {
    this.formControlErrorMessage = new FormControlErrorMessage(
      this.formControl
    );
  }
}

@Component({
  selector: 'dyn-form-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DynamicFormFieldInputComponent,
    DynamicFormFieldSelectComponent,
  ],
  template: `
    <div class="formfield">
      @switch (formField.formFieldType) { @case ('FormFieldInput') {
      <dyn-form-field-input
        [dynFormField]="formField"
        [dynFormControl]="formControl"
      ></dyn-form-field-input>
      } @case ('FormFieldSelect') {
      <lib-formfield-select
        [dynFormField]="formField"
        [dynFormControl]="formControl"
      ></lib-formfield-select>
      } }
    </div>
  `,
  styles: ``,
})
export class DynamicFormfieldComponent implements OnInit {
  @Input() set dynFormControl(value: AbstractControl<unknown, unknown> | null) {
    this.formControl = value as FormControl;
  }
  @Input() set dynFormField(value: AbstractFormField) {
    this.formField = value as FormField<unknown>;
  }

  formControl!: FormControl;
  formField!: FormField<unknown>;

  ngOnInit() {
    console.debug();
  }
}

@Component({
  selector: 'dyn-form-field-array',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ formFieldArray.title }}</mat-card-title>
        <mat-card-subtitle>{{ formFieldArray.subtitle }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="card-content">
        @if(isShowFormFieldShowen){ @for (formFieldControl of
        formArray.controls; track formFieldControl){ @switch
        (formFieldArray.formField.formFieldType) { @case('FormFieldArray') {
        <dyn-form-field-array
          [dynFormField]="formFieldArray.formField"
          [dynFormGroup]="formArray.controls[0]"
        ></dyn-form-field-array>
        } @case ('FormfieldObject') {
        <!-- <lib-formfield-object
          [dynFormField]="formFieldArray.formField"
          [dynFormGroup]="formArray.controls[0]"
          [expended]="isShowFormFieldShowen"
        ></lib-formfield-object>
        } @default {
        <lib-dynamic-formfield
          [dynFormField]="formFieldArray.formField"
          [dynFormControl]="formArray.controls[0]"
        ></lib-dynamic-formfield> -->
        } } } }
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-icon-button (click)="removeFormField()">
          <mat-icon>remove</mat-icon>
        </button>
        <button mat-icon-button (click)="addFormField()">
          <mat-icon>add</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    mat-card-header {
      padding: 10px
    }
    mat-card{
      margin: 10px 0px 10px 0px
    }
  `,
})
export class DynamicFormFieldArrayComponent implements OnInit {
  @Input() set dynFormField(value: AbstractFormField) {
    this.formFieldArray = value as FormFieldArray;
  }
  @Input() set dynFormGroup(value: AbstractControl<unknown, unknown> | null) {
    this.formArray = value as FormArray;
  }

  formArray!: FormArray;
  formFieldArray!: FormFieldArray;
  formFieldSource!: FormControl<unknown>;
  isShowFormFieldShowen!: boolean;

  ngOnInit() {
    this.isShowFormFieldShowen = this.formFieldArray.formField.required;
    this.setFormGroupState();
  }

  addFormField() {
    if (!this.isShowFormFieldShowen && this.formArray.length == 1) {
      this.isShowFormFieldShowen = true;
    } else {
      this.formArray.push(
        new FormControl('', this.formArray.controls[0].validator)
      );
    }
  }

  removeFormField() {
    if (this.formArray.length > 1) {
      this.formArray.removeAt(this.formArray.length - 1);
      this.isShowFormFieldShowen = true;
    } else {
      this.isShowFormFieldShowen = this.formFieldArray.formField.required;
    }
  }

  setFormGroupState() {
    if (!this.isShowFormFieldShowen) {
      this.formArray.disable();
      // this.formArray.controls.forEach((value) => {
      //   value.disable();
      // });
    } else {
      this.formArray.enable();
      // this.formArray.controls.forEach((value) => {
      //   value.enable();
      // });
    }
  }
}

@Component({
  selector: 'dyn-form-field-object',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    DynamicFormfieldComponent,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ formfieldObject.title }}</mat-card-title>
        <mat-card-subtitle>{{ formfieldObject.subtitle }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="card-content">
      @if(isShowFormFieldShowen){ 
        @for (formField of formfieldObject.formFields; track formField){
        <div>
          <dyn-form-field
            [dynFormField]="formField"
            [dynFormControl]="formGroup.get(formField.name)"
          ></dyn-form-field>
        </div>
        } 
      }
      </mat-card-content>
      <mat-card-actions align="end">
      @if(isShowFormFieldShowen){
        <button mat-icon-button (click)="toggleShowFormField()">
          <mat-icon>keyboard_arrow_up</mat-icon>
        </button>
      } @else {
        <button mat-icon-button (click)="toggleShowFormField()">
          <mat-icon>keyboard_arrow_down</mat-icon>
        </button>
      }
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    mat-card {
      margin: 10px 0px 10px 0px
    }
  `,
})
export class DynamicFormFieldObjectComponent implements OnInit {
  @Input() set dynFormField(value: AbstractFormField) {
    this.formfieldObject = value as FormfieldObject;
  }
  @Input() set dynFormGroup(value: AbstractControl<unknown, unknown> | null) {
    this.formGroup = value as FormGroup<object>;
  }
  @Input() expended!: boolean;

  formGroup!: FormGroup<object>;
  formfieldObject!: FormfieldObject;
  isShowFormFieldShowen!: boolean;

  ngOnInit(): void {
    this.isShowFormFieldShowen = this.formfieldObject.required || this.expended;
    this.setFormGroupState();
  }

  toggleShowFormField() {
    this.isShowFormFieldShowen = !this.isShowFormFieldShowen;
    this.setFormGroupState();
  }

  setFormGroupState() {
    if (!this.isShowFormFieldShowen) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }
}

@Component({
  selector: 'dyn-form-content',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DynamicFormFieldArrayComponent,
    DynamicFormFieldObjectComponent,
    DynamicFormfieldComponent,
  ],
  template: `
    <form [formGroup]="formGroup">
    @for (formField of dynFormFields; track formField) {
      <div class="form-row">
      @switch (formField.formFieldType) { 
        @case ('FormFieldArray') {
        <dyn-form-field-array
          [dynFormField]="formField"
          [dynFormGroup]="formGroup.get(formField.name)"
        ></dyn-form-field-array>
        } 
        @case ('FormfieldObject') {
        <dyn-form-field-object
          [dynFormField]="formField"
          [dynFormGroup]="formGroup.get(formField.name)"
        ></dyn-form-field-object>
        } 
        @default {
        <dyn-form-field
          [dynFormField]="formField"
          [dynFormControl]="formGroup.get(formField.name)"
        ></dyn-form-field>
        } 
      }
      </div>
    }
    </form>
  `,
})
export class DynamicFormContentComponent implements OnInit{
  @Input() dynFormFields!: AbstractFormField[];

  formGroup!: FormGroup<object>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.toFormGroup(this.dynFormFields);
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
}
