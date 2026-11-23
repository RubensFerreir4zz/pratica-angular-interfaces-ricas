import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { criarDadosIniciais } from './seed.js';

// "Banco de dados" simples em arquivo JSON, suficiente para a prática.
const arquivo = new URL('./db.json', import.meta.url);

function carregar() {
  if (!existsSync(arquivo)) {
    const dados = criarDadosIniciais();
    writeFileSync(arquivo, JSON.stringify(dados, null, 2));
    return dados;
  }
  return JSON.parse(readFileSync(arquivo, 'utf-8'));
}

const db = carregar();

export function salvar() {
  writeFileSync(arquivo, JSON.stringify(db, null, 2));
}

export function proximoId(lista) {
  return lista.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
}

export default db;
