import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractFormField } from './models';
import { FormControlStatus, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DynamicFormFieldArray,
  DynamicFormFieldObject,
  DynamicFormfield,
} from './form-field';
import { DynamicFormActions } from './form-actions';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { FormGenerator } from './form-generator';

export function isPropertyRequired<T>(property: T | null): boolean {
  return property !== null;
}

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
    <dyn-form-actions actionPosition="end">
      @if (buttonDelete) {
        <button mat-raised-button color="accent" (click)="delete()">
          Delete
        </button>
      }
      @if (formGroup && buttonActionText) {
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
    this.formGroup = FormGenerator.generateFormGroup(this.dynFormFields);
    this.formGroup.valueChanges.subscribe({
      next: (value) => this.formValueChanges.emit(value),
      error: (err) => console.error(err),
    });
    this.formGroup.statusChanges.subscribe({
      next: (value) => this.formStatusChanges.emit(value),
      error: (err) => console.error(err),
    });
  }

  delete() {
    this.deleteValue.emit(this.formGroup.value);
  }

  submit() {
    this.submitValue.emit(this.formGroup.value);
  }
}
