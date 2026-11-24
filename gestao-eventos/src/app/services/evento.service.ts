import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, map, tap } from 'rxjs';
import { Evento, EventoDados } from '../models/evento.model';
import { environment } from '../../environments/environment';

interface EventoApi extends Omit<Evento, 'data'> {
  data: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/eventos`;

  private readonly _eventos = signal<Evento[]>([]);
  private readonly _carregando = signal(false);
  private readonly _erro = signal<string | null>(null);

  readonly eventos = this._eventos.asReadonly();
  readonly carregando = this._carregando.asReadonly();
  readonly erro = this._erro.asReadonly();
  readonly totalEventos = computed(() => this._eventos().length);
  readonly totalAtivos = computed(() => this._eventos().filter((e) => e.ativo).length);

  carregar(): void {
    this._carregando.set(true);
    this._erro.set(null);

    this.http
      .get<EventoApi[]>(this.url)
      .pipe(
        map((lista) => lista.map(daApi)),
        finalize(() => this._carregando.set(false)),
      )
      .subscribe({
        next: (eventos) => this._eventos.set(eventos),
        error: () => this._erro.set('Não foi possível carregar os eventos.'),
      });
  }

  buscarPorId(id: number): Observable<Evento> {
    return this.http.get<EventoApi>(`${this.url}/${id}`).pipe(map(daApi));
  }

  adicionar(dados: EventoDados): Observable<Evento> {
    return this.http.post<EventoApi>(this.url, paraApi(dados)).pipe(
      map(daApi),
      tap((novo) => this._eventos.update((lista) => [...lista, novo])),
    );
  }

  atualizar(id: number, dados: EventoDados): Observable<Evento> {
    return this.http.put<EventoApi>(`${this.url}/${id}`, paraApi(dados)).pipe(
      map(daApi),
      tap((atualizado) =>
        this._eventos.update((lista) => lista.map((e) => (e.id === id ? atualizado : e))),
      ),
    );
  }

  remover(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.url}/${id}`)
      .pipe(tap(() => this._eventos.update((lista) => lista.filter((e) => e.id !== id))));
  }
}

function daApi(evento: EventoApi): Evento {
  const [ano, mes, dia] = evento.data.split('-').map(Number);
  return { ...evento, data: new Date(ano, mes - 1, dia) };
}

function paraApi(dados: EventoDados): Omit<EventoApi, 'id'> {
  const d = dados.data;
  const texto = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
  return { ...dados, data: texto };
}
