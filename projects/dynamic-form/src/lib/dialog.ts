import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AbstractFormField } from './models';
import { DynamicForm } from './form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export enum Action {
  Close = 'Close',
  Submit = 'Submit',
  Delete = 'Delete',
}

export interface DialogData {
  title: string;
  buttonActionText: string;
  buttonDelete: boolean;
  dynFormFields: AbstractFormField[];
}

export interface DialogOutput<T> {
  action: Action;
  value: T;
}

@Component({
  selector: 'dyn-dialog',
  standalone: true,
  imports: [MatDialogModule, DynamicForm, MatButtonModule, MatIconModule],
  template: `
    <div class="header">
      <h1 class="title">{{ data.title }}</h1>
      <button mat-icon-button (click)="onClose()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div class="content">
      <dyn-form
        (deleteValue)="onDelete($event)"
        (submitValue)="onSubmit($event)"
        [buttonActionText]="data.buttonActionText"
        [buttonDelete]="data.buttonDelete"
        [dynFormFields]="data.dynFormFields"
      ></dyn-form>
    </div>
  `,
  styles: `
  .header {
    display: flex; /* Use flexbox layout */
    justify-content: space-between; /* Align items to start and end of the container */
    align-items: center; /* Center items vertically */
    margin: 10px
  }

  .title {
    margin: 10px
  }

  .content {
    margin: 20px
  }
  `,
})
export class DynamicDialog {
  constructor(
    public dialogRef: MatDialogRef<DynamicDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onClose() {
    this.dialogRef.close({ action: Action.Close });
  }

  onSubmit(value: object) {
    this.dialogRef.close({ action: Action.Submit, value: value });
  }

  onDelete(value: object) {
    this.dialogRef.close({ action: Action.Delete, value: value });
  }
}
