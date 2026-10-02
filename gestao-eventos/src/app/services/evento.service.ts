import { Injectable, signal, computed } from '@angular/core';
import { Evento } from '../models/evento.model';

@Injectable({
  providedIn: 'root' 
})

export class EventoService{
    private readonly _eventos = signal<Evento[]>([
        {id: 1, titulo: 'Vaquejada 2026', local: 'Chicote Ranch', data: new Date('2026-11-07'), preco: 10, capacidade: 100, ativo: true},
        {id: 2, titulo: 'Samba Brasil', local: 'Arena das Dunas', data: new Date('2026-01-01'), preco: 20, capacidade: 200, ativo: false},
        {id: 3, titulo: 'Natal Luz', local: 'Praça da Matriz', data: new Date('2026-12-25'), preco: 30, capacidade: 300, ativo: true},
    ])
    
    readonly eventos = this._eventos.asReadonly();
    readonly totalEventos = computed(() => this._eventos().length);
    readonly totalAtivos = computed(() => this._eventos().filter(e => e.ativo).length);

    addEvent(titulo:string, local:string, data:Date, preco:number, capacidade:number, ativo:boolean) {
        const newEvent: Evento = {
            id: this._eventos().length + 1,
            titulo,
            local,
            data,
            preco,
            capacidade,
            ativo
        }
        this._eventos.update((currentEvents) => [...currentEvents, newEvent])
    }

    deleteEvent (id:number){
        this._eventos.update((currentEvents) => currentEvents.filter((e) => e.id !== id))
    }

    updateEvent(id: number, dadosAtualizados: Partial<Evento>) {
        this._eventos.update((currentEvents) =>
            currentEvents.map((evento) =>
                evento.id === id ? { ...evento, ...dadosAtualizados } : evento
            )
        );
    }

    getById (id:number) {
        return this._eventos().find((e) => e.id === id);
    }
}