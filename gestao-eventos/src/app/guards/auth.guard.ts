import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).logado()) return true;

  return inject(Router).createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

export const visitanteGuard: CanActivateFn = () => {
  if (!inject(AuthService).logado()) return true;

  return inject(Router).createUrlTree(['/eventos']);
};
