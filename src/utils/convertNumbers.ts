export function formatCNPJ(cnpj: string): string {
  if (cnpj.length !== 14) {
    throw new Error('Invalid CNPJ length');
  }

  cnpj = cnpj.replace(/[^\d]+/g, '');

  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4-');
}

export function formatDate(data: string): string {
  if (!data || typeof data !== 'string' || data.split('-').length !== 3) {
    return 'Data inválida';
  }

  const parts = data.split('-');
  const dia = parts[2];
  const mes = parts[1];
  const ano = parts[0];

  return `${dia}/${mes}/${ano}`;
}
