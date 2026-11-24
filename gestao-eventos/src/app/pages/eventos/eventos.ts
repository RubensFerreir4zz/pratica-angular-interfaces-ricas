import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { ToastModule } from '@openng/optimus-ui/toast';
import { ConfirmDialogModule } from '@openng/optimus-ui/confirmdialog';
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
  imports: [
    ToastModule,
    ConfirmDialogModule,
    Topbar,
    ResumoEventos,
    EventoTabela,
    EventoFormDialog,
    EventoDetalhesDialog,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './eventos.html',
})
  
export class Eventos implements OnInit, OnDestroy {
  protected readonly eventService = inject(EventoService);
  protected readonly auth = inject(AuthService);
  private readonly mensagens = inject(MessageService);
  private readonly confirmacao = inject(ConfirmationService);

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
      next: (evento) => {
        this.formVisivel.set(false);
        this.avisarSucesso(emEdicao ? 'Evento alterado' : 'Evento criado', evento.titulo);
      },
      error: () => this.avisarErro('Não foi possível salvar o evento.'),
    });
  }

  protected detalhar(evento: Evento) {
    this.eventService.buscarPorId(evento.id).subscribe({
      next: (atualizado) => {
        this.eventoSelecionado.set(atualizado);
        this.detalhesVisivel.set(true);
      },
      error: () => this.avisarErro('Não foi possível carregar o evento.'),
    });
  }

  protected remover(evento: Evento) {
    this.confirmacao.confirm({
      header: 'Remover evento',
      message: `Tem certeza que deseja remover "${evento.titulo}"? Essa ação não pode ser desfeita.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Remover',
      rejectLabel: 'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', text: true },
      accept: () =>
        this.eventService.remover(evento.id).subscribe({
          next: () => this.avisarSucesso('Evento removido', evento.titulo),
          error: () => this.avisarErro('Não foi possível remover o evento.'),
        }),
    });
  }

  private avisarSucesso(resumo: string, detalhe: string) {
    this.mensagens.add({ severity: 'success', summary: resumo, detail: detalhe, life: 3000 });
  }

  private avisarErro(detalhe: string) {
    this.mensagens.add({ severity: 'error', summary: 'Erro', detail: detalhe, life: 5000 });
  }
}