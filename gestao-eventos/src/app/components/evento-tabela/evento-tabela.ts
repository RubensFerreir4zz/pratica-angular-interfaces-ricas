import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from '@openng/optimus-ui/table';
import { TagModule } from '@openng/optimus-ui/tag';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { Evento } from '../../models/evento.model';

@Component({
  selector: 'app-evento-tabela',
  imports: [CurrencyPipe, DatePipe, TableModule, TagModule, ButtonModule, TooltipModule],
  templateUrl: './evento-tabela.html',
})
export class EventoTabela {
  readonly eventos = input.required<Evento[]>();
  readonly carregando = input(false);
  readonly erro = input<string | null>(null);

  readonly detalhar = output<Evento>();
  readonly editar = output<Evento>();
  readonly remover = output<Evento>();
  readonly recarregar = output<void>();
}
