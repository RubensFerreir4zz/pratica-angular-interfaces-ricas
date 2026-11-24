import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TableModule } from '@openng/optimus-ui/table';
import { TagModule } from '@openng/optimus-ui/tag';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { InputNumberModule } from '@openng/optimus-ui/inputnumber';
import { DatePickerModule } from '@openng/optimus-ui/datepicker';
import { CardModule } from '@openng/optimus-ui/card';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { ToolbarModule } from '@openng/optimus-ui/toolbar';
import { EventoService } from './services/evento.service';
import { Evento, EventoDados } from './models/evento.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterOutlet, TableModule, TagModule, ButtonModule, DialogModule, InputTextModule, InputNumberModule, DatePickerModule, CardModule, ToggleSwitchModule, ToolbarModule, ReactiveFormsModule ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html'
})
export class App implements OnInit {
  protected eventService = inject(EventoService);
  private fb = inject(FormBuilder);

  dialogFormVisible = signal<boolean> (false);
  dialogDetailsVisible = signal<boolean> (false);
  eventSelected = signal<Evento | null> (null)
  editMode = signal<boolean>(false);
  filterText = signal<string>('');
  idEventoEdit = signal<number | null>(null);

  formEvento : FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    local: ['', [Validators.required, Validators.minLength(3)]],
    data: ['', Validators.required],
    preco: [0, [Validators.required, Validators.min(0)]],
    capacidade: [10, [Validators.required, Validators.min(1)]],
    ativo: [true]
  })

  // Ao abrir a tela, busca os eventos na API
  ngOnInit() {
    this.eventService.carregar();
  }

  formOpen() {
    this.editMode.set(false);
    this.idEventoEdit.set(null);
    this.formEvento.reset({
      titulo: '',
      local: '',
      data: '',
      preco: 0,
      capacidade: 10,
      ativo: true
    });
    this.dialogFormVisible.set(true);
  }

  formEventEditOpen (evento: Evento){
    this.editMode.set(true);
    this.idEventoEdit.set(evento.id);
    this.formEvento.patchValue({
      titulo: evento.titulo,
      local: evento.local,
      data: new Date(evento.data),
      preco: evento.preco,
      capacidade: evento.capacidade,
      ativo: evento.ativo
    });
    this.dialogFormVisible.set(true)
  }

  formEventSave(){
    if (this.formEvento.invalid) return;

    const dados: EventoDados = this.formEvento.value;
    const id = this.idEventoEdit();

    // Escolhe a requisição (PUT ou POST); o service atualiza a lista quando a API responde
    const requisicao = this.editMode() && id !== null
      ? this.eventService.atualizar(id, dados)
      : this.eventService.adicionar(dados);

    requisicao.subscribe({
      next: () => this.dialogFormVisible.set(false),
      error: () => alert('Não foi possível salvar o evento.'),
    });
  }

  formEventDetailsOpen(id: number) {
    this.eventService.buscarPorId(id).subscribe({
      next: (evento) => {
        this.eventSelected.set(evento);
        this.dialogDetailsVisible.set(true);
      },
      error: () => alert('Não foi possível carregar o evento.'),
    });
  }

  formEventDelete(id: number) {
    this.eventService.remover(id).subscribe({
      error: () => alert('Não foi possível remover o evento.'),
    });
  }


}
