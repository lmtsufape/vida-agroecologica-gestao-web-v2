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
