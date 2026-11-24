import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { InputNumberModule } from '@openng/optimus-ui/inputnumber';

@Component({
  selector: 'app-campo-numero',
  imports: [FormsModule, InputNumberModule],
  templateUrl: './campo-numero.html',
})
export class CampoNumero implements FormValueControl<number | null> {
  readonly value = model<number | null>(null);
  readonly invalid = input(false);
  readonly disabled = input(false);
  readonly touch = output<void>();

  readonly inputId = input<string>();
  readonly moeda = input<string>();
}
