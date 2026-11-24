import { Component, computed, effect, inject, input, model, output, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { InputNumberModule } from '@openng/optimus-ui/inputnumber';
import { DatePickerModule } from '@openng/optimus-ui/datepicker';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { Evento, EventoDados } from '../../models/evento.model';

@Component({
  selector: 'app-evento-form-dialog',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    ToggleSwitchModule,
  ],
  templateUrl: './evento-form-dialog.html',
})
export class EventoFormDialog {
  private readonly fb = inject(FormBuilder);

  readonly visivel = model(false);
  readonly evento = input<Evento | null>(null);

  readonly salvar = output<EventoDados>();

  protected readonly editando = computed(() => this.evento() !== null);

  protected readonly formEvento = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    local: ['', [Validators.required, Validators.minLength(3)]],
    data: [null as Date | null, Validators.required],
    preco: [0, [Validators.required, Validators.min(0)]],
    capacidade: [10, [Validators.required, Validators.min(1)]],
    ativo: [true],
  });

  private readonly preencherAoAbrir = effect(() => {
    if (!this.visivel()) return;
    const evento = this.evento();
    untracked(() =>
      this.formEvento.reset(
        evento
          ? { ...evento }
          : { titulo: '', local: '', data: null, preco: 0, capacidade: 10, ativo: true },
      ),
    );
  });

  protected enviar() {
    if (this.formEvento.invalid) {
      this.formEvento.markAllAsTouched();
      return;
    }
    this.salvar.emit(this.formEvento.getRawValue() as EventoDados);
  }
}
