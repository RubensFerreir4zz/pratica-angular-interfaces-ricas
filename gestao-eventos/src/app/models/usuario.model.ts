export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface Sessao {
  token: string;
  usuario: Usuario;
}

export interface Credenciais {
  email: string;
  senha: string;
}

export interface NovaConta extends Credenciais {
  nome: string;
}
