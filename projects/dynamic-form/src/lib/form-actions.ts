import { Component, Input } from '@angular/core';

@Component({
  selector: 'dyn-form-actions',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  host: {
    '[class.dyn-mdc-form-actions-align-end]': 'actionPosition === "end"',
  },
  styleUrls: ['form.scss'],
})
export class DynamicFormActions {
  @Input() actionPosition: 'start' | 'end' = 'start';
}

// scss not applied with this:
// @Directive({
//   selector: 'dyn-form-actions',
//   exportAs: 'dynFormActions',
//   host: {
//     '[class.dyn-mdc-form-actions-align-end]': 'actionPosition === "end"',
//   },
//   standalone: true,
// })
// export class DynamicFormActions {
//   @Input() actionPosition: 'start' | 'end' = 'start';
// }
