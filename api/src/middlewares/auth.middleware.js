import jwt from 'jsonwebtoken';
import { config } from '../config.js';

// Exige o header "Authorization: Bearer <token>" e anexa o usuário em req.usuario.
export function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensagem: 'Token não informado.' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.usuario = { id: Number(payload.sub), nome: payload.nome, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}
