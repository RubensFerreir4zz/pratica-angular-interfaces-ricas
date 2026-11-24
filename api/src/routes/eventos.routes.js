import { Router } from 'express';
import db, { salvar, proximoId } from '../data/db.js';
import { validarEvento } from '../utils/validar-evento.js';

const router = Router();

function doUsuario(req) {
  return db.eventos.filter((e) => e.usuarioId === req.usuario.id);
}

function buscar(req) {
  return doUsuario(req).find((e) => e.id === Number(req.params.id));
}

function semDono({ usuarioId, ...evento }) {
  return evento;
}

function naoEncontrado(res) {
  return res.status(404).json({ mensagem: 'Evento não encontrado.' });
}

router.get('/', (req, res) => {
  res.json(doUsuario(req).map(semDono));
});

router.get('/:id', (req, res) => {
  const evento = buscar(req);
  if (!evento) return naoEncontrado(res);
  res.json(semDono(evento));
});

router.post('/', (req, res) => {
  const { erros, evento } = validarEvento(req.body);
  if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

  const novo = { id: proximoId(db.eventos), ...evento, usuarioId: req.usuario.id };
  db.eventos.push(novo);
  salvar();
  res.status(201).json(semDono(novo));
});

router.put('/:id', (req, res) => {
  const existente = buscar(req);
  if (!existente) return naoEncontrado(res);

  const { erros, evento } = validarEvento(req.body);
  if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

  Object.assign(existente, evento);
  salvar();
  res.json(semDono(existente));
});

router.delete('/:id', (req, res) => {
  const existente = buscar(req);
  if (!existente) return naoEncontrado(res);

  db.eventos.splice(db.eventos.indexOf(existente), 1);
  salvar();
  res.status(204).end();
});

export default router;
