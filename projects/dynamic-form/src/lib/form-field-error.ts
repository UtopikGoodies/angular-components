import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
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

    if (errors) {
      for (const errorName in errors) {
        switch (errorName) {
          case 'required':
            message = 'You must enter a value';
            break;
          case 'email':
            message = 'Not a valid email';
            break;
          case 'duplicateValues':
            message = 'The alue is already in use';
            break;
        }
      }
    }

    return message;
  }

  // getErrorsMessageDetailed(): string[] {
  //   let errorMessage = [''];

  //   if (this.formControl.invalid && this.formControl instanceof FormGroup) {
  //     const formGroup = this.formControl as FormGroup;

  //     Object.keys(formGroup.controls).forEach((controlName) => {
  //       const control = formGroup.get(controlName);

  //       if (control instanceof FormGroup) {
  //         // If the control is a nested FormGroup, recursively check its controls
  //         // Object.keys(control.controls).forEach(nestedControlName => {
  //         //   const nestedControl = control.get(nestedControlName);
  //         //   if (nestedControl && nestedControl.invalid) {
  //         //     errorMessage.push(`Nested Control ${controlName}.${nestedControlName} is invalid.`);
  //         //   }
  //         // });
  //       } else {
  //         // If the control is a regular FormControl, check its validity
  //         if (control && control.invalid) {
  //           errorMessage.push(`Form field "${controlName}" is invalid.`);
  //         }
  //       }
  //     });
  //   }

  //   return errorMessage;
  // }
}
