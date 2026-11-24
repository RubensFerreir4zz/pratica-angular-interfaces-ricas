import { Component, computed, effect, input, model, output, signal, untracked } from '@angular/core';
import { FormField, form, min, minLength, required, submit } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { Evento, EventoDados } from '../../models/evento.model';
import { CampoData } from '../campo-data/campo-data';
import { CampoNumero } from '../campo-numero/campo-numero';

interface EventoForm {
  titulo: string;
  local: string;
  data: Date | null;
  preco: number | null;
  capacidade: number | null;
  ativo: boolean;
}

const EVENTO_VAZIO: EventoForm = {
  titulo: '',
  local: '',
  data: null,
  preco: 0,
  capacidade: 10,
  ativo: true,
};

@Component({
  selector: 'app-evento-form-dialog',
  imports: [
    FormField,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToggleSwitchModule,
    CampoData,
    CampoNumero,
  ],
  templateUrl: './evento-form-dialog.html',
})
export class EventoFormDialog {
  readonly visivel = model(false);
  readonly evento = input<Evento | null>(null);

  readonly salvar = output<EventoDados>();

  protected readonly editando = computed(() => this.evento() !== null);

  protected readonly modelo = signal<EventoForm>(EVENTO_VAZIO);

  protected readonly eventoForm = form(this.modelo, (campo) => {
    required(campo.titulo, { message: 'Informe o título.' });
    minLength(campo.titulo, 3, { message: 'O título precisa ter pelo menos 3 caracteres.' });
    required(campo.local, { message: 'Informe o local.' });
    minLength(campo.local, 3, { message: 'O local precisa ter pelo menos 3 caracteres.' });
    required(campo.data, { message: 'Informe a data.' });
    required(campo.preco, { message: 'Informe o preço (0 para gratuito).' });
    min(campo.preco, 0, { message: 'O preço não pode ser negativo.' });
    required(campo.capacidade, { message: 'Informe a capacidade.' });
    min(campo.capacidade, 1, { message: 'A capacidade mínima é 1 pessoa.' });
  });

  private readonly preencherAoAbrir = effect(() => {
    if (!this.visivel()) return;
    const evento = this.evento();
    untracked(() => this.eventoForm().reset(evento ? paraFormulario(evento) : { ...EVENTO_VAZIO }));
  });

  protected async enviar(evento: Event) {
    evento.preventDefault();

    await submit(this.eventoForm, async () => {
      this.salvar.emit(this.modelo() as EventoDados);
      return undefined;
    });
  }
}

function paraFormulario({ titulo, local, data, preco, capacidade, ativo }: Evento): EventoForm {
  return { titulo, local, data, preco, capacidade, ativo };
}
