import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { DatePickerModule } from '@openng/optimus-ui/datepicker';

@Component({
  selector: 'app-campo-data',
  imports: [FormsModule, DatePickerModule],
  templateUrl: './campo-data.html',
})
export class CampoData implements FormValueControl<Date | null> {
  readonly value = model<Date | null>(null);
  readonly invalid = input(false);
  readonly disabled = input(false);
  readonly touch = output<void>();

  readonly inputId = input<string>();
}
