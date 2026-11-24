import { Routes } from '@angular/router';
import { authGuard, visitanteGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar | Cadastry',
    canActivate: [visitanteGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'cadastro',
    title: 'Criar conta | Cadastry',
    canActivate: [visitanteGuard],
    loadComponent: () => import('./pages/cadastro/cadastro').then((m) => m.Cadastro),
  },
  {
    path: 'eventos',
    title: 'Eventos | Cadastry',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/eventos/eventos').then((m) => m.Eventos),
  },
  { path: '', pathMatch: 'full', redirectTo: 'eventos' },
  { path: '**', redirectTo: 'eventos' },
];
