import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function distinctValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control instanceof FormArray) {
      const values: any[] = [];
      const duplicateIndices: Set<number> = new Set(); // Track indices of controls with duplicate values
      let duplicatesFound = false; // Flag to track if duplicates are found

      control.controls.forEach(
        (itemControl: AbstractControl, index: number) => {
          let valueToCheck;
          if (itemControl instanceof FormGroup) {
            // Get the value of the nested control
            valueToCheck = Object.values(itemControl.controls)
              .map((ctrl) => ctrl.value)
              .join('');
          } else if (itemControl instanceof FormControl) {
            valueToCheck = itemControl.value;
          } else if (itemControl instanceof FormArray) {
            valueToCheck = collectFormArrayValues(itemControl).join('');
          }

          // Skip validation if the value to check is empty
          if (!valueToCheck) {
            return;
          }

          if (values.includes(valueToCheck)) {
            duplicateIndices.add(index);
            duplicateIndices.add(values.indexOf(valueToCheck));
            duplicatesFound = true; // Set flag to true if duplicates are found
          }
          values.push(valueToCheck);
        }
      );

      // Set error on controls with duplicate values
      if (duplicatesFound) {
        const errors = { duplicateValues: true };
        duplicateIndices.forEach((idx) => {
          control.controls[idx].setErrors(errors);
        });
        return errors;
      } else {
        return null; // Return null if no duplicates found
      }
    }
    return null; // Return null if control is not a FormArray
  };
}

function collectFormArrayValues(
  formArray: FormArray<any>,
  values: any[] = []
): any[] {
  formArray.controls.forEach((itemControl: AbstractControl) => {
    if (itemControl instanceof FormGroup) {
      Object.values(itemControl.controls).forEach((ctrl) => {
        values.push(ctrl.value);
      });
    } else if (itemControl instanceof FormControl) {
      values.push(itemControl.value);
    } else if (itemControl instanceof FormArray) {
      values = collectFormArrayValues(itemControl, values);
    }
  });
  return values;
}
