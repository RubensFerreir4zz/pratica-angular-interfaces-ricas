import bcrypt from 'bcryptjs';

// Dados iniciais usados quando src/data/db.json ainda não existe.
export function criarDadosIniciais() {
  return {
    usuarios: [
      {
        id: 1,
        nome: 'Administrador',
        email: 'admin@cadastry.com',
        senhaHash: bcrypt.hashSync('123456', 10),
      },
    ],
    eventos: [
      { id: 1, titulo: 'Vaquejada 2026', local: 'Chicote Ranch', data: '2026-11-07', preco: 10, capacidade: 100, ativo: true },
      { id: 2, titulo: 'Samba Brasil', local: 'Arena das Dunas', data: '2026-01-01', preco: 20, capacidade: 200, ativo: false },
      { id: 3, titulo: 'Natal Luz', local: 'Praça da Matriz', data: '2026-12-25', preco: 30, capacidade: 300, ativo: true },
    ],
  };
}
