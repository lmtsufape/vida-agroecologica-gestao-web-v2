export interface ViaCepResponseData {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export async function fetchAddressFunction(
  cep: string,
): Promise<ViaCepResponseData> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data?.erro == 'true') {
      throw new Error('CEP não encontrado.');
    }
    return data;
  } catch (error) {
    if (error instanceof Error && error?.message === 'CEP não encontrado.') {
      console.debug('CEP não encontrado.');
      throw error;
    }
    console.debug('Erro ao buscar o CEP.');
    throw new Error('Erro ao buscar o CEP.');
  }
}
