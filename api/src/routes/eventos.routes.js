import { Router } from 'express';
import db, { salvar, proximoId } from '../data/db.js';
import { validarEvento } from '../utils/validar-evento.js';

const router = Router();

function buscar(id) {
  return db.eventos.find((e) => e.id === Number(id));
}

// GET /api/eventos -> lista todos
router.get('/', (req, res) => {
  res.json(db.eventos);
});

// GET /api/eventos/:id -> detalha um
router.get('/:id', (req, res) => {
  const evento = buscar(req.params.id);
  if (!evento) return res.status(404).json({ mensagem: 'Evento não encontrado.' });
  res.json(evento);
});

// POST /api/eventos -> inclui
router.post('/', (req, res) => {
  const { erros, evento } = validarEvento(req.body);
  if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

  const novo = { id: proximoId(db.eventos), ...evento };
  db.eventos.push(novo);
  salvar();
  res.status(201).json(novo);
});

// PUT /api/eventos/:id -> altera
router.put('/:id', (req, res) => {
  const existente = buscar(req.params.id);
  if (!existente) return res.status(404).json({ mensagem: 'Evento não encontrado.' });

  const { erros, evento } = validarEvento(req.body);
  if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

  Object.assign(existente, evento);
  salvar();
  res.json(existente);
});

// DELETE /api/eventos/:id -> remove
router.delete('/:id', (req, res) => {
  const indice = db.eventos.findIndex((e) => e.id === Number(req.params.id));
  if (indice === -1) return res.status(404).json({ mensagem: 'Evento não encontrado.' });

  db.eventos.splice(indice, 1);
  salvar();
  res.status(204).end();
});

export default router;
