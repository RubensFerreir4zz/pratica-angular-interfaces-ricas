import { Component, inject, output, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormField,
  email,
  form,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { AuthService } from '../../services/auth.service';
import { NovaConta } from '../../models/usuario.model';

interface CadastroForm extends NovaConta {
  confirmarSenha: string;
}

@Component({
  selector: 'app-cadastro',
  imports: [FormField, ButtonModule, InputTextModule],
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private readonly auth = inject(AuthService);

  protected readonly dados = signal<CadastroForm>({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  protected readonly cadastroForm = form(this.dados, (campo) => {
    required(campo.nome, { message: 'Informe seu nome.' });
    minLength(campo.nome, 3, { message: 'O nome precisa ter pelo menos 3 caracteres.' });
    required(campo.email, { message: 'Informe o email.' });
    email(campo.email, { message: 'Email inválido.' });
    required(campo.senha, { message: 'Informe uma senha.' });
    minLength(campo.senha, 6, { message: 'A senha precisa ter pelo menos 6 caracteres.' });

    validate(campo.confirmarSenha, ({ value, valueOf }) =>
      value() !== valueOf(campo.senha)
        ? { kind: 'senhasDiferentes', message: 'As senhas não conferem.' }
        : undefined,
    );
  });

  protected readonly erroCadastro = signal<string | null>(null);

  readonly irParaLogin = output<void>();

  protected async cadastrar(evento: Event) {
    evento.preventDefault();
    this.erroCadastro.set(null);

    await submit(this.cadastroForm, async () => {
      const { nome, email, senha } = this.dados();
      try {
        await firstValueFrom(this.auth.registrar({ nome, email, senha }));
      } catch (erro) {
        const status = (erro as HttpErrorResponse).status;
        this.erroCadastro.set(
          status === 409
            ? 'Já existe uma conta com este email.'
            : 'Não foi possível criar a conta. Tente novamente.',
        );
      }
      return undefined;
    });
  }
}
