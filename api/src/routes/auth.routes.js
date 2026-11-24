import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { salvar, proximoId } from '../data/db.js';
import { config } from '../config.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = Router();

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function criarSessao(usuario) {
  const token = jwt.sign({ nome: usuario.nome, email: usuario.email }, config.jwtSecret, {
    subject: String(usuario.id),
    expiresIn: config.jwtExpiresIn,
  });
  return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } };
}

// POST /api/auth/registro  { nome, email, senha } -> 201 { token, usuario }
router.post('/registro', async (req, res) => {
  const { nome, email, senha } = req.body ?? {};
  const erros = [];

  if (typeof nome !== 'string' || nome.trim().length < 3) {
    erros.push('nome deve ter pelo menos 3 caracteres.');
  }
  if (typeof email !== 'string' || !EMAIL_VALIDO.test(email.trim())) {
    erros.push('email inválido.');
  }
  if (typeof senha !== 'string' || senha.length < 6) {
    erros.push('senha deve ter pelo menos 6 caracteres.');
  }
  if (erros.length) {
    return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
  }

  const emailNormalizado = email.trim().toLowerCase();
  if (db.usuarios.some((u) => u.email === emailNormalizado)) {
    return res.status(409).json({ mensagem: 'Já existe uma conta com este email.' });
  }

  const usuario = {
    id: proximoId(db.usuarios),
    nome: nome.trim(),
    email: emailNormalizado,
    senhaHash: await bcrypt.hash(senha, 10),
  };
  db.usuarios.push(usuario);
  salvar();

  res.status(201).json(criarSessao(usuario));
});

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

  res.json(criarSessao(usuario));
});

// GET /api/auth/me -> dados do usuário do token
router.get('/me', autenticar, (req, res) => {
  res.json(req.usuario);
});

export default router;
