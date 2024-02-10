import { AbstractControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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
  formControl: AbstractControl;

  constructor(formControl: AbstractControl) {
    this.formControl = formControl;
  }

  getErrorMessage(): string {
    let message: string = 'Unknown error';
    const errors = this.formControl.errors;

    console.debug(errors)
    if (errors) {
      for (const errorName in errors) {
        console.debug(errorName);
        switch (errorName) {
          case 'required':
            message = 'You must enter a value';
            break;
          case 'email':
            message = 'Not a valid email';
            break;
          case 'duplicateValues':
            message = 'The value is already in use';
            break;
        }
      }
    }

    return message;
  }
}
