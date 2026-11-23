import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { autenticar } from './middlewares/auth.middleware.js';
import authRoutes from './routes/auth.routes.js';
import eventosRoutes from './routes/eventos.routes.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas por JWT
app.use('/api/eventos', autenticar, eventosRoutes);

// 404 para rotas desconhecidas
app.use((req, res) => res.status(404).json({ mensagem: 'Rota não encontrada.' }));

// Erros inesperados (inclui JSON malformado no corpo)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensagem: 'JSON inválido no corpo da requisição.' });
  }
  console.error(err);
  res.status(500).json({ mensagem: 'Erro interno do servidor.' });
});

export default app;
