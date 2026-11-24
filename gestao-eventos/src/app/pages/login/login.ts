import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormField, email, form, minLength, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { AuthService } from '../../services/auth.service';
import { Credenciais } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  imports: [FormField, RouterLink, ButtonModule, InputTextModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);

  // 1) O model do formulário é um signal comum
  protected readonly credenciais = signal<Credenciais>({ email: '', senha: '' });

  // 2) form() cria a árvore de campos e as regras de validação
  protected readonly loginForm = form(this.credenciais, (campo) => {
    required(campo.email, { message: 'Informe o email.' });
    email(campo.email, { message: 'Email inválido.' });
    required(campo.senha, { message: 'Informe a senha.' });
    minLength(campo.senha, 6, { message: 'A senha tem pelo menos 6 caracteres.' });
  });

  // Erro vindo da API (email/senha errados, API fora do ar...)
  protected readonly erroLogin = signal<string | null>(null);

  private readonly router = inject(Router);

  readonly returnUrl = input<string>();

  // 3) submit() marca os campos como tocados, valida e só chama a ação se estiver tudo válido
  protected async entrar(evento: Event) {
    evento.preventDefault();
    this.erroLogin.set(null);

    await submit(this.loginForm, async () => {
      try {
        await firstValueFrom(this.auth.login(this.credenciais()));
        await this.router.navigateByUrl(destinoSeguro(this.returnUrl()));
      } catch (erro) {
        const status = (erro as HttpErrorResponse).status;
        this.erroLogin.set(
          status === 401 ? 'Email ou senha inválidos.' : 'Não foi possível conectar à API.',
        );
      }
      return undefined;
    });
  }
}

function destinoSeguro(url: string | undefined): string {
  return url?.startsWith('/') && !url.startsWith('//') ? url : '/eventos';
}
