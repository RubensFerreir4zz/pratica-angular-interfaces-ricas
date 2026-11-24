# Front-end — Gestão de Eventos

Aplicação Angular 22 com OptimusUI 2 e Tailwind 4. Consome a API em `../api`, que precisa estar rodando. Veja o [README principal](../README.md) para o passo a passo completo.

## Como rodar

```bash
npm install
npm start          # http://localhost:4200
```

O endereço da API fica em `src/environments/environment.ts` (`http://localhost:3000/api`).

## Rotas

| URL | Tela | Acesso |
|---|---|---|
| `/login` | Login | Só para quem não está logado |
| `/cadastro` | Criar conta | Só para quem não está logado |
| `/eventos` | Painel de eventos | Só para quem está logado |

Qualquer outro endereço redireciona para `/eventos`, e quem não estiver logado é levado ao login.

## Comandos

| Comando | O que faz |
|---|---|
| `npm start` | Servidor de desenvolvimento, recarrega ao salvar |
| `npm run build` | Build de produção em `dist/` |
| `npm test` | Testes unitários com Vitest |
