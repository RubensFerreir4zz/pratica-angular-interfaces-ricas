# Prática sobre Angular — Cadastry (Gestão de Eventos)

Aplicação para cadastrar e gerenciar eventos, com login e cadastro de conta. Cada usuário vê e edita apenas os próprios eventos.

O enunciado da atividade e os critérios de avaliação estão em [`orientacoes.md`](orientacoes.md).

## Tecnologias

| Parte | Tecnologias |
|---|---|
| Front-end (`gestao-eventos/`) | Angular 22 (Signals, Signal Forms, Router, HttpClient), OptimusUI 2, Tailwind 4 |
| Back-end (`api/`) | Node.js, Express 5, JWT (`jsonwebtoken`), `bcryptjs` |

## Como rodar

**Pré-requisito:** Node.js 22.9 ou mais recente.

São dois terminais, um para a API e outro para o front-end.

**1. API** (http://localhost:3000/api)

```bash
cd api
npm install
npm run dev
```

**2. Front-end** (http://localhost:4200)

```bash
cd gestao-eventos
npm install
npm start
```

Abra http://localhost:4200 e entre com o usuário de teste, ou crie uma conta em **Criar conta**.

| Email | Senha |
|---|---|
| `admin@cadastry.com` | `123456` |

Os dados da API ficam em `api/src/data/db.json`, criado na primeira execução. Para voltar aos dados iniciais, apague esse arquivo e reinicie a API.

## Funcionalidades

- Login, cadastro de conta e logout, com sessão mantida após recarregar a página
- Listar, detalhar, incluir, alterar e remover eventos
- Painel com total de eventos, ativos e inativos
- Validação dos formulários no front-end (Signal Forms) e na API
- Rotas do front-end protegidas por guard e API protegida por JWT

## Estrutura

```
├── api/                        Back-end (detalhes e endpoints em api/README.md)
│   └── src/
│       ├── routes/             auth (login, registro) e eventos (CRUD)
│       ├── middlewares/        validação do token JWT
│       └── data/               "banco" em arquivo JSON
│
└── gestao-eventos/             Front-end
    └── src/app/
        ├── pages/              login, cadastro, eventos (uma por rota)
        ├── components/         topbar, resumo, tabela, diálogos e campos de formulário
        ├── services/           EventoService e AuthService (estado em signals + HttpClient)
        ├── guards/             authGuard e visitanteGuard
        ├── interceptors/       envia o token em toda requisição
        ├── models/             Evento e Usuario
        └── app.routes.ts       /login, /cadastro, /eventos
```

## Onde está cada requisito

| Requisito | Arquivos |
|---|---|
| Model com string, number, date e boolean | `models/evento.model.ts` |
| Componentes e comunicação com signals (`input`, `output`, `model`) | `pages/eventos/` e `components/` |
| Services com estado e acesso à API | `services/evento.service.ts`, `services/auth.service.ts` |
| Signal Forms no cadastro e na edição | `components/evento-form-dialog/`, `pages/login/`, `pages/cadastro/` |
| Rotas | `app.routes.ts` |
| HttpClient | `services/` |
| Login, rotas protegidas e API protegida | `pages/login/`, `guards/auth.guard.ts`, `interceptors/auth.interceptor.ts`, `api/src/middlewares/auth.middleware.js` |

## Scripts úteis

| Pasta | Comando | O que faz |
|---|---|---|
| `api/` | `npm run dev` | Sobe a API e reinicia ao salvar |
| `api/` | `npm start` | Sobe a API sem recarregamento automático |
| `gestao-eventos/` | `npm start` | Sobe o front-end em modo desenvolvimento |
| `gestao-eventos/` | `npm run build` | Gera o build de produção em `dist/` |
| `gestao-eventos/` | `npm test` | Roda os testes unitários (Vitest) |
