// Valida o corpo de um evento. Retorna { erros, evento } com os dados normalizados.
export function validarEvento(body) {
  const erros = [];
  const { titulo, local, data, preco, capacidade, ativo } = body ?? {};

  if (typeof titulo !== 'string' || titulo.trim().length < 3) {
    erros.push('titulo deve ter pelo menos 3 caracteres.');
  }
  if (typeof local !== 'string' || local.trim().length < 3) {
    erros.push('local deve ter pelo menos 3 caracteres.');
  }
  if (typeof data !== 'string' || Number.isNaN(Date.parse(data))) {
    erros.push('data deve ser uma data válida (ex: 2026-12-25).');
  }
  if (typeof preco !== 'number' || preco < 0) {
    erros.push('preco deve ser um número maior ou igual a 0.');
  }
  if (!Number.isInteger(capacidade) || capacidade < 1) {
    erros.push('capacidade deve ser um inteiro maior ou igual a 1.');
  }
  if (typeof ativo !== 'boolean') {
    erros.push('ativo deve ser true ou false.');
  }

  if (erros.length) return { erros };

  return {
    erros,
    evento: {
      titulo: titulo.trim(),
      local: local.trim(),
      data: new Date(data).toISOString().slice(0, 10),
      preco,
      capacidade,
      ativo,
    },
  };
}
