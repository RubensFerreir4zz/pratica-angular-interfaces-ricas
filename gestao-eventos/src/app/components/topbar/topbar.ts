import { Component, input, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-topbar',
  imports: [ButtonModule],
  templateUrl: './topbar.html',
})
export class Topbar {
  readonly usuario = input<Usuario | null>(null);

  readonly novoEvento = output<void>();
  readonly sair = output<void>();
}
