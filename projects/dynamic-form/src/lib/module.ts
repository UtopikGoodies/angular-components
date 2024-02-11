import { NgModule } from '@angular/core';
import { DynamicFormActions } from './form-actions';
import { DynamicForm } from './form';

const FORM_DIRECTIVES: any[] = [
  DynamicForm,
  DynamicFormActions,
];

@NgModule({
  imports: [...FORM_DIRECTIVES],
  exports: [FORM_DIRECTIVES],
})
export class DynFormModule {}
