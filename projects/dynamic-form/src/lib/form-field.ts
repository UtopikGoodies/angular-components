import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ReactiveFormsModule,
  AbstractControl,
  FormControl,
  FormArray,
  FormGroup,
} from '@angular/forms';
import {
  FormControlErrorMessage,
  CustomErrorStateMatcher,
} from './form-field-error';
import {
  AbstractFormField,
  FormField,
  FormFieldArray,
  FormFieldInput,
  FormFieldSelect,
  Option,
  OptionGroup,
  FormfieldObject,
} from './models';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormGenerator } from './form-generator';

@Component({
  selector: 'dyn-form-field-label',
  standalone: true,
  imports: [MatFormFieldModule],
  template: `
    <div class="label" [style.display]="formField.hidden ? 'none' : ''">
      <label [attr.for]="formField.name">{{ formField.title }}:</label
      >{{ formField.value }}
    </div>
  `,
  styles: `
    .label {
      display: flex;
      align-items: center;
      margin: 10px 0 10px 5px;
    }

    .label label {
      margin-right: 8px;
      font-weight: bold;
    }
  `,
})
export class DynamicFormfieldLabel {
  @Input() set dynFormControl(value: AbstractControl<unknown, unknown> | null) {
    this.formControl = value as FormControl<unknown>;
  }
  @Input() set dynFormField(value: FormField<unknown>) {
    this.formField = value as FormFieldInput<unknown>;
  }

  formControl!: FormControl<unknown>;
  formField!: FormFieldInput<unknown>;
}

@Component({
  selector: 'dyn-form-field-input',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatFormFieldModule],
  template: `
    <mat-form-field class="full-width" [style.display]="formField.hidden ? 'none' : ''" appearance="fill">
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
      }
      @if (formField.hint) {
        <mat-hint>{{ formField.hint }}</mat-hint>
      }
      @if (formControl.invalid) {
        <mat-error>{{ formControlErrorMessage.getErrorMessage() }}</mat-error>
      }
    </mat-form-field>
  `,
  styles: `
    mat-form-field {
      width: 100%;
      margin: 10px 0px 10px 0px;
    }
  `,
})
export class DynamicFormFieldInput implements OnInit {
  @Input() set dynFormControl(value: AbstractControl<unknown, unknown> | null) {
    this.formControl = value as FormControl<unknown>;
  }
  @Input() set dynFormField(value: FormField<unknown>) {
    this.formField = value as FormFieldInput<unknown>;
  }

  formControl!: FormControl<unknown>;
  formControlErrorMessage!: FormControlErrorMessage;
  formField!: FormFieldInput<unknown>;
  matcher: CustomErrorStateMatcher;

  constructor() {
    this.matcher = new CustomErrorStateMatcher();
  }

  ngOnInit(): void {
    this.formControlErrorMessage = new FormControlErrorMessage(
      this.formControl,
    );
  }
}

@Component({
  selector: 'dyn-form-field-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  template: `
    <mat-form-field class="full-width" [style.display]="formField.hidden ? 'none' : ''" appearance="fill">
      <mat-label [attr.for]="formField.name">{{ formField.title }}</mat-label>

      <mat-select
        [formControl]="formControl"
        [errorStateMatcher]="matcher"
        [placeholder]="formField.placeholder"
      >
        @if (formField.optionNone) {
          <mat-option>-- None --</mat-option>
        }

        @for (option of formField.options; track option) {
          @if (isOptionGroup(option)) {
            <mat-optgroup [label]="option.name" [disabled]="option.disabled">
              @for (groupOption of option.options; track groupOption) {
                <mat-option [value]="groupOption.value">{{
                  groupOption.viewValue
                }}</mat-option>
              }
            </mat-optgroup>
          } @else {
            <mat-option [value]="option.value">{{
              option.viewValue
            }}</mat-option>
          }
        }
      </mat-select>

      @if (formField.icon) {
        <mat-icon matSuffix>{{ formField.icon }}</mat-icon>
      }
      @if (formField.hint) {
        <mat-hint>{{ formField.hint }}</mat-hint>
      }
      @if (formControl.invalid) {
        <mat-error>{{ formControlErrorMessage.getErrorMessage() }}</mat-error>
      }
    </mat-form-field>
  `,
  styles: `
    mat-form-field {
      width: 100%;
    }
    mat-form-field {
      margin: 10px 0px 10px 0px;
    }
  `,
})
export class DynamicFormFieldSelect implements OnInit {
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
  formFieldOptionGroups?: OptionGroup<unknown>[];

  constructor() {
    this.matcher = new CustomErrorStateMatcher();
  }

  ngOnInit(): void {
    this.formControlErrorMessage = new FormControlErrorMessage(
      this.formControl,
    );
  }

  isOptionGroup(option: any): option is OptionGroup {
    return option.type === 'OptionGroup';
  }
}

@Component({
  selector: 'dyn-form-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DynamicFormFieldInput,
    DynamicFormFieldSelect,
    DynamicFormfieldLabel,
  ],
  template: `
    <div class="formfield">
      @switch (formField.formFieldType) {
        @case ('FormFieldInput') {
          <dyn-form-field-input
            [dynFormField]="formField"
            [dynFormControl]="formControl"
          ></dyn-form-field-input>
        }
        @case ('FormFieldSelect') {
          <dyn-form-field-select
            [dynFormField]="formField"
            [dynFormControl]="formControl"
          ></dyn-form-field-select>
        }
        @case ('FormfieldLabel') {
          <dyn-form-field-label
            [dynFormField]="formField"
            [dynFormControl]="formControl"
          ></dyn-form-field-label>
        }
      }
    </div>
  `,
  styles: ``,
})
export class DynamicFormfield {
  @Input() set dynFormControl(value: AbstractControl<unknown, unknown> | null) {
    this.formControl = value as FormControl;
  }
  @Input() set dynFormField(value: AbstractFormField) {
    this.formField = value as FormField<unknown>;
  }

  formControl!: FormControl;
  formField!: FormField<unknown>;
}

@Component({
  selector: 'dyn-form-field-object',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, DynamicFormfield],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ formfieldObject.title }}</mat-card-title>
        <mat-card-subtitle>{{ formfieldObject.subtitle }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="card-content">
        @if (isFormFieldShowen()) {
          @for (formField of formfieldObject.formFields; track formField) {
            <div>
              <dyn-form-field
                [dynFormField]="formField"
                [dynFormControl]="formGroup.get(formField.name)"
              ></dyn-form-field>
            </div>
          }
        }
      </mat-card-content>
      @if (!isParentArray()) {
        <mat-card-actions align="end">
          @if (isFormFieldShowen()) {
            <button mat-icon-button [disabled]="this.formfieldObject.required" (click)="toggleShowFormField()">
              <mat-icon>remove</mat-icon>
            </button>
          } @else {
            <button mat-icon-button (click)="toggleShowFormField()">
              <mat-icon>add</mat-icon>
            </button>
          }
        </mat-card-actions>
      }
    </mat-card>
  `,
  styles: `
    mat-card {
      margin: 10px 0px 10px 0px;
    }
  `,
})
export class DynamicFormFieldObject implements OnInit {
  @Input() set dynFormField(value: AbstractFormField) {
    this.formfieldObject = value as FormfieldObject;
  }
  @Input() set dynFormGroup(value: AbstractControl<unknown, unknown> | null) {
    this.formGroup = value as FormGroup<object>;
  }
  @Input() expended!: boolean;

  formGroup!: FormGroup<object>;
  formfieldObject!: FormfieldObject;
  showFormField!: boolean;

  ngOnInit(): void {
  }

  toggleShowFormField() {
    if (this.isFormFieldShowen()) {
      this.showFormField = false;
    } else {
      this.showFormField = true;
    }
  }

  isFormFieldShowen(): boolean {
    const hasRequiredField = this.formfieldObject.required;
    const hasVisibleField = this.showFormField;
    const hasSingleEmptyField =
      this.formfieldObject.formFields.length > 0 &&
      this.formfieldObject.formFields[0] instanceof FormField &&
      this.formfieldObject.formFields[0].value !== null;

    const result = hasRequiredField || hasVisibleField || hasSingleEmptyField
    if (result) {
      this.formGroup.enable();
    } else {
      this.formGroup.disable();
    }

    this.showFormField = result;

    return result;
  }

  isParentArray(): boolean {
    return this.formGroup.parent instanceof FormArray;
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
    DynamicFormfield,
    DynamicFormFieldObject,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ formFieldArray.title }}</mat-card-title>
        <mat-card-subtitle>{{ formFieldArray.subtitle }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="card-content">
        @if (isFormFieldShowen()) {
          @for (
            formField of formFieldArray.formFields;
            track formField;
            let index = $index
          ) {
            @switch (formField.formFieldType) {
              @case ('FormFieldArray') {
                <dyn-form-field-array
                  [dynFormField]="formField"
                  [dynFormGroup]="formArray.get(index.toString())"
                ></dyn-form-field-array>
              }
              @case ('FormfieldObject') {
                <dyn-form-field-object
                  [dynFormField]="formField"
                  [dynFormGroup]="formArray.get(index.toString())"
                  [expended]="isFormFieldShowen()"
                ></dyn-form-field-object>
              }
              @default {
                <dyn-form-field
                  [dynFormField]="formField"
                  [dynFormControl]="formArray.get(index.toString())"
                ></dyn-form-field>
              }
            }
          }
        }
      </mat-card-content>
      <mat-card-actions align="end">
        <button
          mat-icon-button
          (click)="removeFormField()"
          [disabled]="
            (formArray.length <= 1 && formFieldModel.required) ||
            !isFormFieldShowen()
          "
        >
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
      padding: 10px;
    }
    mat-card {
      margin: 10px 0px 10px 0px;
    }
  `,
})
export class DynamicFormFieldArray implements OnInit, OnChanges {
  @Input()
  get dynFormField(): AbstractFormField {
    return this.formFieldArray;
  }
  set dynFormField(value: AbstractFormField) {
    this.formFieldArray = value as FormFieldArray;
  }
  @Input()
  get dynFormGroup(): FormArray {
    return this.formArray;
  }
  set dynFormGroup(value: AbstractControl<unknown, unknown> | null) {
    this.formArray = value as FormArray;
  }

  formArray!: FormArray;
  formFieldArray!: FormFieldArray;
  formFieldModel!: AbstractFormField;
  showFormField!: boolean;

  ngOnInit() {
    this.formFieldModel = { ...this.formFieldArray.formFields[0] };
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  addFormField() {
    if (this.isFormFieldShowen()) {
      this.formFieldArray.formFields.push(this.formFieldModel);
      this.formArray.push(
        FormGenerator.generateFormGroup([
          this.formFieldModel
        ], true).get(this.formFieldModel.name),
      );
    } else {
      this.showFormField = true;
    }
  }

  removeFormField() {
    // if (this.formFieldArray.formFields.length > 1) {
    this.formFieldArray.formFields.pop();
    this.formArray.removeAt(this.formArray.length - 1);
    // } else {
    //   this.showFormField = false;
    // }
  }

  isFormFieldShowen(): boolean {
    const hasRequiredField = this.formFieldArray.required;
    const hasVisibleField = this.showFormField;
    const hasMultipleFields = this.formFieldArray.formFields.length > 1;
    const hasSingleEmptyField =
      this.formFieldArray.formFields.length === 1 &&
      this.formFieldArray.formFields[0] instanceof FormField &&
      this.formFieldArray.formFields[0].name === "" &&
      this.formFieldArray.formFields[0].value === null;

    const result = hasRequiredField || hasVisibleField || hasMultipleFields || !hasSingleEmptyField;
    if (result) {
      this.formArray.enable();
    } else {
      this.formArray.disable();
    }

    this.showFormField = result;

    return result;
  }
}
