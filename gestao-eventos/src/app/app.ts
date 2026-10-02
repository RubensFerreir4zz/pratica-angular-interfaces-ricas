import { Component, signal, inject } from '@angular/core';
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
import { Evento } from './models/evento.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterOutlet, TableModule, TagModule, ButtonModule, DialogModule, InputTextModule, InputNumberModule, DatePickerModule, CardModule, ToggleSwitchModule, ToolbarModule, ReactiveFormsModule ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html'
})
export class App {
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
    if (this.formEvento.valid){
      const dados = this.formEvento.value;
      if (this.editMode() && this.idEventoEdit() !== null){
        this.eventService.updateEvent(this.idEventoEdit()!, dados);
      }else{
        this.eventService.addEvent(dados.titulo, dados.local, dados.data, dados.preco, dados.capacidade, dados.ativo);
      }
      this.dialogFormVisible.set(false)
    }
  }
  formEventDetailsOpen(id: number) {
    const evento = this.eventService.getById(id);
    if (evento) {
      this.eventSelected.set(evento);
      this.dialogDetailsVisible.set(true);
    }
  }

  formEventDelete(id: number) {
    this.eventService.deleteEvent(id);
  }


}
