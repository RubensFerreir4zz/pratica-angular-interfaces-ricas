export interface Evento {
  id: number;
  titulo: string;
  local: string;
  data: Date;
  preco: number;
  capacidade: number;
  ativo: boolean;
}

export type EventoDados = Omit<Evento, 'id'>;
