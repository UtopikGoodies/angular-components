import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

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