import { Component, input, model } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { TagModule } from '@openng/optimus-ui/tag';
import { Evento } from '../../models/evento.model';

@Component({
  selector: 'app-evento-detalhes-dialog',
  imports: [CurrencyPipe, DatePipe, ButtonModule, DialogModule, TagModule],
  templateUrl: './evento-detalhes-dialog.html',
})
export class EventoDetalhesDialog {
  readonly visivel = model(false);
  readonly evento = input<Evento | null>(null);
}
