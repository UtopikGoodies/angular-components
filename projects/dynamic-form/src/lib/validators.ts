import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function duplicateValueValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent;
    if (!formGroup) {
      return null; // No parent form group
    }

    const formGroupControls = Object.keys(formGroup.controls);
    const currentValue = control.value;

    if (!currentValue) {
      return null;
    }

    // Check if there are any controls with the same value
    const isDuplicate = formGroupControls
      .filter((name) => name !== controlName) // Exclude the current control
      .some((name) => formGroup.get(name)?.value === currentValue);

    // If a duplicate value is found, set the custom error
    if (isDuplicate) {
      return { duplicateValue: true };
    }

    return null; // No error
  };
}

export function duplicateValueValidatorInArray(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null; // No parent FormArray
    }

    const formArray: FormArray = control.parent as FormArray;
    const controls = formArray.controls;
    const currentValue = control.value;

    if (!currentValue) {
      return null; // If current value is falsy, no need to check for duplicates
    }

    // Count occurrences of the current value in the array
    const duplicateCount = controls.filter(
      (ctrl) => ctrl.value === currentValue
    ).length;

    // If there's more than one occurrence, it means there's a duplicate
    if (duplicateCount > 1) {
      return { duplicateValue: true };
    }

    return null; // No duplicates found, no error
  };
}

// ChatGPT
// export function distinctValuesValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     if (!(control instanceof FormGroup)) {
//       return null; // If not a FormGroup, don't perform validation
//     }

//     const group = control as FormGroup; // Cast control to FormGroup
//     const controlValues = Object.values(group.value);
//     const distinctValues = new Set(controlValues);
//     if (controlValues.length !== distinctValues.size) {
//       return { distinctValues: true }; // Validation error if not all values are distinct
//     }
//     return null; // No error
//   };
// }

// Gemini
export function distinctValuesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlValues = control.value;
    const uniqueValues = new Set(controlValues);

    if (controlValues.length !== uniqueValues.size) {
      return { distinctValues: true }; // Return an error object
    }

    return null; // No errors
  };
}