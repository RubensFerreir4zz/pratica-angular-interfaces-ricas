import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../data/db.js';
import { config } from '../config.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/auth/login  { email, senha } -> { token, usuario }
router.post('/login', async (req, res) => {
  const { email, senha } = req.body ?? {};

  if (typeof email !== 'string' || typeof senha !== 'string') {
    return res.status(400).json({ mensagem: 'Informe email e senha.' });
  }

  const usuario = db.usuarios.find((u) => u.email === email.trim().toLowerCase());
  const senhaOk = usuario && (await bcrypt.compare(senha, usuario.senhaHash));

  if (!senhaOk) {
    return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
  }

  const token = jwt.sign({ nome: usuario.nome, email: usuario.email }, config.jwtSecret, {
    subject: String(usuario.id),
    expiresIn: config.jwtExpiresIn,
  });

  res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
});

// GET /api/auth/me -> dados do usuário do token
router.get('/me', autenticar, (req, res) => {
  res.json(req.usuario);
});

export default router;
