# API — Gestão de Eventos

API REST em Node.js + Express com autenticação JWT, consumida pelo frontend Angular em `../gestao-eventos`.

## Como rodar

```bash
cd api
npm install
cp .env.example .env   # opcional: ajuste JWT_SECRET
npm run dev            # http://localhost:3000/api (reinicia ao salvar)
```

Os dados ficam em `src/data/db.json`, criado automaticamente na primeira execução. Apague esse arquivo para voltar aos dados iniciais.

**Usuário de teste:** `admin@cadastry.com` / `123456`

## Endpoints

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| POST | `/api/auth/registro` | Não | Recebe `{ nome, email, senha }`, cria a conta e devolve `{ token, usuario }` (`409` se o email já existir) |
| POST | `/api/auth/login` | Não | Recebe `{ email, senha }` e devolve `{ token, usuario }` |
| GET | `/api/auth/me` | Sim | Dados do usuário logado |
| GET | `/api/eventos` | Sim | Lista os eventos do usuário logado |
| GET | `/api/eventos/:id` | Sim | Detalha um evento |
| POST | `/api/eventos` | Sim | Inclui um evento |
| PUT | `/api/eventos/:id` | Sim | Altera um evento |
| DELETE | `/api/eventos/:id` | Sim | Remove um evento |

Rotas protegidas exigem o header `Authorization: Bearer <token>`; sem ele a API responde `401`.

Cada usuário só acessa os próprios eventos: tentar ler, alterar ou remover o evento de outra conta responde `404`.

### Corpo de um evento

```json
{
  "titulo": "Natal Luz",
  "local": "Praça da Matriz",
  "data": "2026-12-25",
  "preco": 30,
  "capacidade": 300,
  "ativo": true
}
```

## Estrutura

```
src/
├── server.js                  # sobe o servidor
├── app.js                     # configura Express, CORS e rotas
├── config.js                  # variáveis de ambiente
├── data/                      # "banco" em arquivo JSON + dados iniciais
├── middlewares/auth.middleware.js  # valida o JWT
├── routes/                    # auth e eventos
└── utils/validar-evento.js    # validação do corpo do evento
```
