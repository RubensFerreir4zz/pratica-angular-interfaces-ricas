import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-resumo-eventos',
  templateUrl: './resumo-eventos.html',
})
export class ResumoEventos {
  readonly total = input.required<number>();
  readonly ativos = input.required<number>();

  protected readonly inativos = computed(() => this.total() - this.ativos());
}
