import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../services/auth.service';
import { Evento, EventoDados } from '../../models/evento.model';
import { Topbar } from '../../components/topbar/topbar';
import { ResumoEventos } from '../../components/resumo-eventos/resumo-eventos';
import { EventoTabela } from '../../components/evento-tabela/evento-tabela';
import { EventoFormDialog } from '../../components/evento-form-dialog/evento-form-dialog';
import { EventoDetalhesDialog } from '../../components/evento-detalhes-dialog/evento-detalhes-dialog';

@Component({
  selector: 'app-eventos',
  imports: [Topbar, ResumoEventos, EventoTabela, EventoFormDialog, EventoDetalhesDialog],
  templateUrl: './eventos.html',
})
  
export class Eventos implements OnInit, OnDestroy {
  protected readonly eventService = inject(EventoService);
  protected readonly auth = inject(AuthService);

  protected readonly formVisivel = signal(false);
  protected readonly eventoEmEdicao = signal<Evento | null>(null);

  protected readonly detalhesVisivel = signal(false);
  protected readonly eventoSelecionado = signal<Evento | null>(null);

  ngOnInit() {
    this.eventService.carregar();
  }

  ngOnDestroy() {
    this.eventService.limpar();
  }

  protected sair() {
    this.auth.logout();
  }

  protected novo() {
    this.eventoEmEdicao.set(null);
    this.formVisivel.set(true);
  }

  protected editar(evento: Evento) {
    this.eventoEmEdicao.set(evento);
    this.formVisivel.set(true);
  }

  protected salvar(dados: EventoDados) {
    const emEdicao = this.eventoEmEdicao();
    const requisicao = emEdicao
      ? this.eventService.atualizar(emEdicao.id, dados)
      : this.eventService.adicionar(dados);

    requisicao.subscribe({
      next: () => this.formVisivel.set(false),
      error: () => alert('Não foi possível salvar o evento.'),
    });
  }

  protected detalhar(evento: Evento) {
    this.eventService.buscarPorId(evento.id).subscribe({
      next: (atualizado) => {
        this.eventoSelecionado.set(atualizado);
        this.detalhesVisivel.set(true);
      },
      error: () => alert('Não foi possível carregar o evento.'),
    });
  }

  protected remover(evento: Evento) {
    if (!confirm(`Remover o evento "${evento.titulo}"?`)) return;

    this.eventService.remover(evento.id).subscribe({
      error: () => alert('Não foi possível remover o evento.'),
    });
  }
}