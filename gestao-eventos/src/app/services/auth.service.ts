import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { Credenciais, NovaConta, Sessao, Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

const CHAVE_STORAGE = 'gestao-eventos.sessao';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _sessao = signal<Sessao | null>(lerSessaoSalva());

  readonly usuario = computed<Usuario | null>(() => this._sessao()?.usuario ?? null);
  readonly token = computed<string | null>(() => this._sessao()?.token ?? null);
  readonly logado = computed(() => this._sessao() !== null);

  login(credenciais: Credenciais): Observable<Usuario> {
    return this.http
      .post<Sessao>(`${environment.apiUrl}/auth/login`, credenciais)
      .pipe(tap((sessao) => this.iniciarSessao(sessao)), map((sessao) => sessao.usuario));
  }

  registrar(conta: NovaConta): Observable<Usuario> {
    return this.http
      .post<Sessao>(`${environment.apiUrl}/auth/registro`, conta)
      .pipe(tap((sessao) => this.iniciarSessao(sessao)), map((sessao) => sessao.usuario));
  }

  private iniciarSessao(sessao: Sessao): void {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(sessao));
    this._sessao.set(sessao);
  }

  logout(): void {
    localStorage.removeItem(CHAVE_STORAGE);
    this._sessao.set(null);
    this.router.navigate(['/login']);
  }
}

function lerSessaoSalva(): Sessao | null {
  const texto = localStorage.getItem(CHAVE_STORAGE);
  if (!texto) return null;

  try {
    const sessao: Sessao = JSON.parse(texto);
    if (tokenExpirado(sessao.token)) {
      localStorage.removeItem(CHAVE_STORAGE);
      return null;
    }
    return sessao;
  } catch {
    localStorage.removeItem(CHAVE_STORAGE);
    return null;
  }
}

function tokenExpirado(token: string): boolean {
  const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
}
